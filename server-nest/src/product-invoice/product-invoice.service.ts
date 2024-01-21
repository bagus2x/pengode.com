import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import * as crypto from 'crypto'
import { ClsService } from 'nestjs-cls'
import { DataSource, In, LessThan, Repository } from 'typeorm'

import { ConfigService } from '@nestjs/config'
import { PageResponse } from '@pengode/common/dtos'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import {
  ProductInvoice,
  Status,
} from '@pengode/product-invoice/product-invoice'
import {
  CreateInvoiceRequest,
  FindAllRequest,
  InvoiceResponse,
  ListenNotificationRequest,
} from '@pengode/product-invoice/product-invoice.dto'
import { Product } from '@pengode/product/product'
import { User } from '@pengode/user/user'
import Decimal from 'decimal.js'
import { ProductInvoiceHistory } from '@pengode/product-invoice-history/product-invoice-history'

@Injectable()
export class ProductInvoiceService {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource,
    @InjectRepository(ProductInvoice)
    private readonly productInvoiceRepository: Repository<ProductInvoice>,
    private readonly clsService: ClsService,
    private readonly configService: ConfigService,
  ) {}

  async create(req: CreateInvoiceRequest) {
    const invoice = await this.dataSource.transaction(async (entityManager) => {
      const productInvoiceRepository =
        entityManager.getRepository(ProductInvoice)
      const productRepository = entityManager.getRepository(Product)
      const productInvoiceItemRepository =
        entityManager.getRepository(ProductInvoiceItem)
      const productInvoiceHistoryRepository = entityManager.getRepository(
        ProductInvoiceHistory,
      )
      const userRepository = entityManager.getRepository(User)

      const customer = await userRepository.findOne({
        where: { id: this.clsService.get<number>('userId') },
      })
      if (!customer) {
        throw new NotFoundException('customer is not found')
      }

      const products = await Promise.all(
        req.productIds.map(async (productId) => {
          const product = await productRepository.findOne({
            where: { id: productId },
          })
          if (!product) {
            throw new NotFoundException(
              `product with id ${productId} is not found`,
            )
          }
          return product
        }),
      )

      const grossAmount = ProductInvoice.grossAmount(products)

      const { orderId, token, redirectUrl } = await this.createTransaction(
        grossAmount,
        customer,
        products,
      )

      const invoice = await productInvoiceRepository.save({
        orderId,
        customer,
        status: Status.PENDING,
        token,
        redirectUrl,
      })

      invoice.items = await Promise.all(
        products.map(async (product) => {
          return await productInvoiceItemRepository.save({
            invoice,
            product,
            price: product.price,
            discount: product.discount,
          })
        }),
      )

      const history = await productInvoiceHistoryRepository.save({
        invoice,
        status: Status.PENDING,
      })
      invoice.histories = [history]

      return invoice
    })

    return InvoiceResponse.create(invoice)
  }

  private async createTransaction(
    grossAmount: Decimal,
    customer: User,
    products: Product[],
  ) {
    const midtransTransactionUrl = this.configService.get<string>(
      'MIDTRANS_TRANSACTIONS_URL',
    )
    const midtransServerKey = this.configService.get<string>(
      'MIDTRANS_SERVER_KEY',
    )
    const token = btoa(`${midtransServerKey}:`)
    const orderId = crypto.randomUUID()
    try {
      const res = await axios.post<{ token: string; redirect_url: string }>(
        midtransTransactionUrl,
        {
          transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount,
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            first_name: customer.name,
            email: customer.email,
            phone: customer.phone,
          },
          item_details: products.map((product) => ({
            id: product.id,
            price: product.price.times(product.discount || 1).toString(),
            quantity: 1,
            name: product.title,
            category: product.categories.length
              ? product.categories.map((category) => category.name).join(', ')
              : undefined,
            merchant_name: 'Pengode',
          })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        },
      )

      return {
        orderId,
        token: res.data.token,
        redirectUrl: res.data.redirect_url,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new InternalServerErrorException(
          error?.response?.data?.error_messages?.join(', '),
        )
      }
      throw error
    }
  }

  async findAll(req: FindAllRequest): Promise<PageResponse<InvoiceResponse>> {
    const products = await this.productInvoiceRepository.find({
      where: {
        id: LessThan(req.cursor),
        status: req.statuses ? In(req.statuses) : undefined,
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
    })

    return {
      items: products.map(InvoiceResponse.create),
      nextCursor: products[products.length - 1]?.id || 0,
    }
  }

  async findById(invoiceId: number): Promise<InvoiceResponse> {
    const invoice = await this.productInvoiceRepository.findOne({
      where: { id: invoiceId },
    })
    if (!invoice) {
      throw new NotFoundException('invoice is not found')
    }

    return InvoiceResponse.create(invoice)
  }

  async listenNotifications(
    req: ListenNotificationRequest,
  ): Promise<InvoiceResponse> {
    const invoice = await this.dataSource.transaction(async (entityManager) => {
      if (!this.isValidSignatureKey(req)) {
        throw new ForbiddenException('signature key is invalid')
      }

      const productInvoiceRepository =
        entityManager.getRepository(ProductInvoice)
      const productInvoiceHistoryRepository = entityManager.getRepository(
        ProductInvoiceHistory,
      )

      const invoice = await productInvoiceRepository.findOne({
        where: { orderId: req.orderId },
      })
      if (!invoice) {
        throw new NotFoundException('invoice is not found')
      }

      if (req.transactionStatus == 'capture') {
        if (req.fraudStatus == 'accept') {
          invoice.status = Status.PAID
          invoice.paymentMethod = req.paymentType
        }
      } else if (req.transactionStatus == 'settlement') {
        invoice.status = Status.PAID
        invoice.paymentMethod = req.paymentType
      } else if (
        req.transactionStatus == 'cancel' ||
        req.transactionStatus == 'deny' ||
        req.transactionStatus == 'expire'
      ) {
        invoice.status = Status.CANCELED
      } else if (req.transactionStatus == 'pending') {
        invoice.status = Status.PENDING_PAYMENT
      }

      const updatedInvoice = await productInvoiceRepository.save(invoice)

      await productInvoiceHistoryRepository.save({
        invoice,
        status: invoice.status,
      })

      return updatedInvoice
    })

    return InvoiceResponse.create(invoice)
  }

  private isValidSignatureKey(req: ListenNotificationRequest): boolean {
    const midtransServerKey = this.configService.get<string>(
      'MIDTRANS_SERVER_KEY',
    )
    const signatureKey = crypto
      .createHash('sha512')
      .update(
        `${req.orderId}${req.statusCode}${req.grossAmount}${midtransServerKey}`,
      )
      .digest('hex')

    return req.signatureKey === signatureKey
  }
}

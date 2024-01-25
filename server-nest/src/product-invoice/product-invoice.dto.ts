import { ApiProperty } from '@nestjs/swagger'
import { PageRequest } from '@pengode/common/dtos'
import { HistoryResponse } from '@pengode/product-invoice-history/product-invoice-history.dto'
import { ItemResponse } from '@pengode/product-invoice-item/product-invoice-item.dto'
import {
  ProductInvoice,
  Status,
} from '@pengode/product-invoice/product-invoice'
import { UserResponse } from '@pengode/user/user.dto'
import { Expose, Transform } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  NotEquals,
} from 'class-validator'

export class CreateInvoiceRequest {
  @IsArray()
  @ArrayUnique()
  @IsPositive({ each: true })
  @NotEquals(null, { each: true })
  @NotEquals(undefined, { each: true })
  @IsNumber({}, { each: true })
  @ApiProperty()
  @ApiProperty()
  productIds: number[]
}

export class InvoiceResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  status: Status

  @ApiProperty()
  customer: Omit<UserResponse, 'roles'>

  @ApiProperty()
  items: ItemResponse[]

  @ApiProperty()
  grossAmount: string

  @ApiProperty()
  token: string

  @ApiProperty()
  redirectUrl: string

  @ApiProperty()
  histories: Omit<HistoryResponse, 'invoiceId'>[]

  @ApiProperty()
  createdAt: Date

  static create(invoice: ProductInvoice): InvoiceResponse {
    return {
      id: invoice.id,
      status: invoice.status,
      customer: {
        id: invoice.customer.id,
        email: invoice.customer.email,
        username: invoice.customer.username,
        phone: invoice.customer.phone,
        name: invoice.customer.name,
        photo: invoice.customer.photo,
      },
      items: invoice.items.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          title: item.product.title,
          previewUrl: item.product.previewUrl,
          price: item.product.price.toString(),
          discount: item.product.discount,
        },
        price: item.price.toString(),
        discount: item.discount,
        createdAt: item.createdAt,
      })),
      token: invoice.token,
      redirectUrl: invoice.redirectUrl,
      histories: invoice.histories.map((history) => ({
        id: history.id,
        status: history.status,
        createdAt: history.createdAt,
      })),
      grossAmount: ProductInvoice.grossAmount(invoice.items).toString(),
      createdAt: invoice.createdAt,
    }
  }
}

export class FindAllRequest extends PageRequest {
  @IsArray()
  @IsOptional()
  @IsEnum(Status, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiProperty()
  statuses?: Status[]
}

export class ListenNotificationRequest {
  @Expose({ name: 'transaction_time' })
  @ApiProperty({ name: 'transaction_time' })
  transactionTime: string

  @Expose({ name: 'transaction_status' })
  @ApiProperty({ name: 'transaction_status' })
  transactionStatus: string

  @Expose({ name: 'transaction_id' })
  @ApiProperty({ name: 'transaction_id' })
  transactionId: string

  @Expose({ name: 'status_message' })
  @ApiProperty({ name: 'status_message' })
  statusMessage: string

  @Expose({ name: 'status_code' })
  @ApiProperty({ name: 'status_code' })
  statusCode: string

  @Expose({ name: 'signature_key' })
  @ApiProperty({ name: 'signature_key' })
  signatureKey: string

  @Expose({ name: 'payment_type' })
  @ApiProperty({ name: 'payment_type' })
  paymentType: string

  @Expose({ name: 'order_id' })
  @ApiProperty({ name: 'order_id' })
  orderId: string

  @Expose({ name: 'merchant_id' })
  @ApiProperty({ name: 'merchant_id' })
  merchantId: string

  @Expose({ name: 'masked_card' })
  @ApiProperty({ name: 'masked_card' })
  maskedCard: string

  @Expose({ name: 'gross_amount' })
  @ApiProperty({ name: 'gross_amount' })
  grossAmount: string

  @Expose({ name: 'fraud_status' })
  @ApiProperty({ name: 'fraud_status' })
  fraudStatus: string

  @Expose({ name: 'eci' })
  @ApiProperty({ name: 'eci' })
  eci: string

  @Expose({ name: 'currency' })
  @ApiProperty({ name: 'currency' })
  currency: string

  @Expose({ name: 'channel_response_message' })
  @ApiProperty({ name: 'channel_response_message' })
  channelResponseMessage: string

  @Expose({ name: 'channel_response_code' })
  @ApiProperty({ name: 'channel_response_code' })
  channelResponseCode: string

  @Expose({ name: 'card_type' })
  @ApiProperty({ name: 'card_type' })
  cardType: string

  @Expose({ name: 'bank' })
  @ApiProperty({ name: 'bank' })
  bank: string

  @Expose({ name: 'approval_code' })
  @ApiProperty({ name: 'approval_code' })
  approvalCode: string
}

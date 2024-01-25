import { InvoiceDetail } from '@pengode/components/main/invoice/invoice-detail'
import { getInvoice, getInvoices } from '@pengode/data/product-invoice'

type InvoiceDetailProps = {
  params: {
    invoiceId: string
  }
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailProps) {
  const invoice = await getInvoice(parseInt(params.invoiceId))

  return (
    <main className='py-4'>
      <InvoiceDetail invoice={invoice} className='px-4' />
    </main>
  )
}

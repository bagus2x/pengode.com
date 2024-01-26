import { IsNumber, IsPositive } from 'class-validator'

export class AddProductRequest {
  @IsPositive()
  @IsNumber()
  productId: number
}

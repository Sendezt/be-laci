import { IsBoolean } from "class-validator";

export class UpdateProductStatusDto {
    @IsBoolean({message: 'is_active harus berupa boolean'})
    is_active: boolean;
}
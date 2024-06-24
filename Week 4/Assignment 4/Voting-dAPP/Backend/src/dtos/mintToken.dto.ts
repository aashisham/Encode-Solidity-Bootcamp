import { ApiProperty } from "@nestjs/swagger";

export class MintTokenDto {
    @ApiProperty({type: String, required: true, default: "0x36956b321bdd1c78C340c9241d5F870937730208"})
    address: string;

    @ApiProperty({ type: String, required: true, default: "1000000000000000000" }) // default for 1 token with 18 decimals
    amount: string;
}
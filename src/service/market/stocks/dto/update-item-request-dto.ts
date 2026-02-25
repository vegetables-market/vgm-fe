import type { EditStockRequestDto } from "./edit-stock-request-dto";
import type { NewStockRequestDto } from "./new-stock-request-dto";

export type UpdateItemRequestDto = NewStockRequestDto | EditStockRequestDto;


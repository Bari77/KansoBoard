import { Injectable } from "@angular/core";
import { ColumnDto } from "@features/columns/dto/column.dto";
import { Column } from "@features/columns/models/column.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";
import { ColumnOrderDto } from "../dto/column-order.dto";

@Injectable()
export class ColumnsService extends BaseService {
    protected override baseUrlService = "Columns";

    public getByBoard(boardId: string): Observable<Column[]> {
        return this.httpList<ColumnDto, Column>(Column, `board/${boardId}`);
    }

    public get(id: string): Observable<Column | null> {
        return this.httpGet<ColumnDto, Column>(Column, id);
    }

    public create(boardId: string, name: string): Observable<Column> {
        return this.httpPost<ColumnDto, Column>(Column, "", { boardId, name });
    }

    public update(id: string, name: string): Observable<Column | null> {
        return this.httpPut<ColumnDto, Column>(Column, id, { name });
    }

    public reorder(boardId: string, orders: ColumnOrderDto[]): Observable<void> {
        return this.httpPostVoid(`${boardId}/reorder`, orders);
    }

    public delete(id: string): Observable<void> {
        return this.httpDelete(id);
    }
}

import { Injectable } from "@angular/core";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";
import { CardOrderDto } from "../dto/card-order.dto";
import { CardDto } from "../dto/card.dto";
import { Card } from "../models/card.model";

@Injectable()
export class CardsService extends BaseService {
    protected override baseUrlService = "Cards";

    public getByBoard(boardId: string): Observable<Card[]> {
        return this.httpList<CardDto, Card>(Card, `board/${boardId}`);
    }

    public get(id: string): Observable<Card | null> {
        return this.httpGet<CardDto, Card>(Card, id);
    }

    public create(
        columnId: string,
        title: string,
        description: string | null,
        type: number,
        priority: number,
    ): Observable<Card> {
        return this.httpPost<CardDto, Card>(Card, "", { columnId, title, description, type, priority });
    }

    public update(
        id: string,
        title: string,
        description?: string | null,
        type?: number,
        priority?: number,
    ): Observable<Card | null> {
        return this.httpPut<CardDto, Card>(Card, id, {
            title,
            description,
            type,
            priority,
        });
    }

    public delete(id: string): Observable<void> {
        return this.httpDelete(id);
    }

    public assign(id: string, userId: string | null): Observable<void> {
        return this.httpPostVoid(`${id}/assign`, { userId: userId });
    }

    public move(id: string, newColumnId: string): Observable<void> {
        return this.httpPostVoid(`${id}/move`, { newColumnId });
    }

    public reorder(columnId: string, orders: CardOrderDto[]): Observable<void> {
        return this.httpPostVoid(`${columnId}/reorder`, orders);
    }

    public transfer(id: string, boardId: string) {
        return this.httpPostVoid(`${id}/transfer`, { boardId });
    }
}

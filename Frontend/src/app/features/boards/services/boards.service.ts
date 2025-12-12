import { Injectable } from "@angular/core";
import { BoardDto } from "@features/boards/dto/board.dto";
import { Board } from "@features/boards/models/board.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class BoardsService extends BaseService {
    protected override baseUrlService = "Boards";

    public getByProject(projectId: string): Observable<Board[]> {
        return this.httpList<BoardDto, Board>(Board, `project/${projectId}`);
    }

    public get(id: string): Observable<Board | null> {
        return this.httpGet<BoardDto, Board>(Board, id);
    }

    public create(projectId: string, name: string): Observable<Board> {
        return this.httpPost<BoardDto, Board>(Board, "", { projectId, name });
    }

    public update(id: string, name: string): Observable<Board | null> {
        return this.httpPut<BoardDto, Board>(Board, id, { name });
    }

    public delete(id: string): Observable<void> {
        return this.httpDelete(id);
    }
}

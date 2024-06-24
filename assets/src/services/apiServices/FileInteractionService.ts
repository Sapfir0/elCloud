import { isRight } from 'fp-ts/lib/Either';
import { inject, injectable } from 'inversify';
import { SERVICE_IDENTIFIER } from '../../inversify/inversifyTypes';
import { definitions } from '../../shared/types/EndpointDescription';
import { BaseInteractionError } from '../errors/BaseInteractionError';
import { ApiRoutes, API_URL } from '../serverRouteContants';
import { ApiInteractionService } from 'api_interaction_services'

@injectable()
export class FileInteractionService {
    public isLastRequestErrored: BaseInteractionError | null = null;
    public defaultElementsPerPage: undefined | number = undefined;
    public defaultPage = 0;

    constructor(@inject(SERVICE_IDENTIFIER.ApiInteractionService) protected _apiService: ApiInteractionService) {}

    public getFiles = async (directory = '.', page = this.defaultPage, perPage = this.defaultElementsPerPage) => {
        const res = await this._apiService.get<{ data: definitions['File'][] }>(ApiRoutes.FILE.GET_ALL_FILES, {
            directory,
            page,
            page_size: perPage,
        });
        if (isRight(res)) {
            return res.right.data;
        } else {
            this.isLastRequestErrored = res.left;
        }
    };

    public updateFile = async (oldDirectory: string, newDirectory: string) => {
        const res = await this._apiService.put<{ data: definitions['File'][] }>(ApiRoutes.FILE.GET_ALL_FILES, {
            oldPath: oldDirectory,
            newPath: newDirectory,
        });
        if (isRight(res)) {
            return res.right.data;
        } else {
            this.isLastRequestErrored = res.left;
        }
    };

    public uploadFile = async (file: File, directory: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', directory);

        const res = await this._apiService.post<{ data: definitions['File'][] }>(
            ApiRoutes.FILE.GET_ALL_FILES,
            formData,
            API_URL,
            { multipartData: true },
        );
        if (isRight(res)) {
            return res.right.data;
        } else {
            this.isLastRequestErrored = res.left;
        }
    };

    // deprecated
    public getFile = async (path: string) => {
        const res = await this._apiService.get<{ data: definitions['File'][] }>(ApiRoutes.FILE.GET_FILE(path), {
            path: path,
        });
        if (isRight(res)) {
            return res.right.data;
        } else {
            this.isLastRequestErrored = res.left;
        }
    };

    public removeFile = async (path: string) => {
        const res = await this._apiService.delete<{ data: definitions['File'][] }>(ApiRoutes.FILE.GET_ALL_FILES, {
            path: path,
        });
        if (isRight(res)) {
            return res.right.data;
        } else {
            this.isLastRequestErrored = res.left;
        }
    };
}

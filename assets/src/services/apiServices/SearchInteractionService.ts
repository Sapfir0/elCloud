import { isRight } from 'fp-ts/lib/Either';
import { inject, injectable } from 'inversify';
import { SERVICE_IDENTIFIER } from '../../inversify/inversifyTypes';
import { BaseInteractionError } from '../errors/BaseInteractionError';
import { ApiRoutes } from '../serverRouteContants';
import { ApiInteractionService } from 'api_interaction_services'
@injectable()
export class SearchInteractionService {
    public isLastRequestErrored: BaseInteractionError | null = null;

    constructor(@inject(SERVICE_IDENTIFIER.ApiInteractionService) protected _apiService: ApiInteractionService) {}

    public search = async (query: string, directory: string) => {
        const res = await this._apiService.get(ApiRoutes.SEARCH.GET_SEARCH, {
            directory,
            query,
        });
        if (isRight(res)) {
            return res.right.data;
        } else {
            this.isLastRequestErrored = res.left;
        }
    };
}

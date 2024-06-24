import { Container } from 'inversify';
import 'reflect-metadata';
import { FileListDropdownStore } from '../components/FileListFactory/FileListFactoryDropdownStore';
import { FilesListFactoryStore } from '../components/FileListFactory/FilesListFactoryStore';
import { FilesListStore } from '../components/FilesList/FileListStore';
import { FileUploadStore } from '../components/FileUpload/FileUploadStore';
import { FileViewStore } from '../components/FileView/FileViewStore';
import { SearchStore } from '../components/Search/SearchStore';
import { SortableTreeStore } from '../components/SortableTree/SortableTreeStore';
import { TableFileStore } from '../components/Table/TableFileStore';
import { FileInteractionService } from '../services/apiServices/FileInteractionService';
import { SearchInteractionService } from '../services/apiServices/SearchInteractionService';
import { FileSystemChecker } from '../services/socket';
import { SERVICE_IDENTIFIER } from './inversifyTypes';
import {ApiInteractionService} from 'api_interaction_services'
import { API_URL } from '../services/serverRouteContants';


const container = new Container();
container.bind<FilesListStore>(SERVICE_IDENTIFIER.FilesListStore).to(FilesListStore).inSingletonScope();
container.bind<ApiInteractionService>(SERVICE_IDENTIFIER.ApiInteractionService).toConstantValue(new ApiInteractionService(API_URL));
container.bind(SERVICE_IDENTIFIER.FileInteractionService).to(FileInteractionService);
container.bind(SERVICE_IDENTIFIER.FileSystemChecker).to(FileSystemChecker).inSingletonScope();
container.bind(SERVICE_IDENTIFIER.FileListDropdownStore).to(FileListDropdownStore).inSingletonScope();
container.bind(SERVICE_IDENTIFIER.SortableTreeStore).to(SortableTreeStore).inSingletonScope();
container.bind(SERVICE_IDENTIFIER.TableFileStore).to(TableFileStore).inSingletonScope();
container.bind(SERVICE_IDENTIFIER.SearchInteractionService).to(SearchInteractionService).inSingletonScope();
container.bind(SERVICE_IDENTIFIER.SearchStore).to(SearchStore).inSingletonScope();
container.bind(SERVICE_IDENTIFIER.FileUploadStore).to(FileUploadStore).inSingletonScope();
container.bind(SERVICE_IDENTIFIER.FilesListFactoryStore).to(FilesListFactoryStore).inSingletonScope();
container.bind(SERVICE_IDENTIFIER.FileViewStore).to(FileViewStore);


export default container;

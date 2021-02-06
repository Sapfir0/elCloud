import { Card, Grid, ListItem, ListItemIcon, Paper } from "@material-ui/core"
import React, { FC, useEffect } from "react"
import {FileViewDTO} from "../../shared/types/DTO"
import "./FileView.css"
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { Link, useHistory, useLocation } from "react-router-dom";
import { ClientRoutes } from "../../services/clientRouteContants";
import { useInject } from "../../shared/hooks/injectHook";
import { SERVICE_IDENTIFIER } from "../../inversify/inversifyTypes";
import { FilesListStore } from "../../components/FilesList/FilesListStore";

export type FileViewProps = {
  file: FileViewDTO
}

export const FileView: FC<FileViewProps> = (props) => {
  const filesListStore = useInject<FilesListStore>(SERVICE_IDENTIFIER.FilesListStore)
  const history = useHistory()

  useEffect(() => {
    return history.listen((location: {pathname: string}) => {
      filesListStore.setCurrentDirectory(location.pathname.replace(ClientRoutes.Index, ""))  // подразумевается, что  мы находимся на этой странице
    })
  },[history])

  const {file} = props
  const newDir = `${filesListStore.currentDirectory}/${file.filename}`
  return <> <ListItem key={file.filename} role='listitem' button={file.isFolder}>
    <ListItemIcon>
      {file.isFolder && <FolderIcon/>}
      {!file.isFolder && <InsertDriveFileIcon />}
    </ListItemIcon>
    {file.isFolder && <Link to={`${ClientRoutes.Index}${newDir}`}>{file.filename} </Link>}
    {!file.isFolder && file.filename }
    </ListItem>   </>
}

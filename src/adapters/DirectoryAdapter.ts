import { useDispatch, useSelector } from 'react-redux'
import { useLocalDirectoryDatabase } from '../infrastructure/databases/LocalDirectoryDatabase'
import { selectAnsestors, selectFileContent, selectFileMetadata, selectFileStatus, selectFolderContent, selectFolderMetadata, selectFolderStatus, useReduxDirectoryState } from '../infrastructure/state/DirectoryState'
import { DirectoryState } from '../domain/repositories/DirectoryState'
import * as File from '../domain/usecases/File'
import * as Folder from '../domain/usecases/Folder'
import { AppDispatch } from '../infrastructure/state/app/store'
import { Directory } from '../domain/entities/Directory'
import { useMemo } from 'react'

const databaseId = 'db1'

export function useFileAdapter(metadata: Pick<Directory.FileContent, 'id'>) {
  const dispatch: AppDispatch = useDispatch()
  const directoryState: DirectoryState = useReduxDirectoryState(dispatch)
  const localDirectoryDatabase = useLocalDirectoryDatabase(databaseId)
  
  const fileMetadata = useSelector(selectFileMetadata(metadata))
  const fileContent = useSelector(selectFileContent(metadata))
  const fileStatus = useSelector(selectFileStatus(metadata))

  const file: Directory.FileType = {...fileContent, ...fileMetadata}

  const createFile = useMemo(() => (params: Pick<File.createFileParams, 'name'>) => {
    File.createFile({
      parentId: metadata.id,
      name: params.name,
    }, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const fetchFileMetadata = useMemo(() => () => {
    File.fetchFileMetadata(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const fetchFileContent = useMemo(() => () => {
    File.fetchFileContent(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const fetchFile = useMemo(() => () => {
    File.fetchFile(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const deleteFile = useMemo(() => () => {
    File.deleteFile(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const updateContent = useMemo(() => (newContent: Directory.FileContent['content']) => {
    File.saveFile({
      ...file,
      content: newContent
    }, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  return {
    createFile,
    fetchFileMetadata,
    fetchFileContent,
    fetchFile,
    deleteFile,
    updateContent,
    fileMetadata,
    fileContent,
    fileStatus,
  }
}

export function useFolderAdapter(metadata: Pick<Directory.FolderMetadata, 'id' | 'parentId'> = Directory.RootNode) {
  const dispatch: AppDispatch = useDispatch()
  const directoryState: DirectoryState = useReduxDirectoryState(dispatch)
  const localDirectoryDatabase = useLocalDirectoryDatabase(databaseId)

  const createFolder = useMemo(() => (params: Pick<File.createFileParams, 'name'>) => {
    Folder.createFolder({
      name: params.name,
      parentId: metadata.id,
    }, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const fetchFolderContent = useMemo(() => () => {
    Folder.fetchFolderContent(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const deleteFolder = useMemo(() => () => {
    Folder.deleteFolder(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const fetchParentMetadata = useMemo(() => () => {
    Folder.fetchParentMetadata(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const fetchAnsestors = useMemo(() => () => {
    Folder.fetchAnsestors(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const fetchFolderMetadata = useMemo(() => () => {
    Folder.fetchFolderMetadata(metadata, localDirectoryDatabase, directoryState)
  }, [metadata.id])

  const folderContent = useSelector(selectFolderContent(metadata))
  const folderMetadata = useSelector(selectFolderMetadata(metadata))
  const folderStatus = useSelector(selectFolderStatus(metadata))
  const ansestors = useSelector(selectAnsestors(metadata))

  return {
    createFolder,
    fetchFolderContent,
    deleteFolder,
    fetchParentMetadata,
    fetchAnsestors,
    fetchFolderMetadata,
    folderContent,
    folderMetadata,
    folderStatus,
    ansestors,
  }
}
import styles from './index.module.scss'
import { ReactComponent as FolderIcon } from '../../icons/folder.svg'
import { ReactComponent as FileIcon } from '../../icons/file.svg'
import { ReactComponent as ChevronRightIcon } from '../../icons/chevron-right.svg'
import { ReactComponent as TrashIcon } from '../../icons/trash.svg'
import { ReactComponent as RenameIcon } from '../../icons/rename.svg'
import { ReactComponent as LinkExternalIcon } from '../../icons/link-external.svg'
import { ReactComponent as NewFileIcon } from '../../icons/new-file.svg'
import { ReactComponent as NewFolderIcon } from '../../icons/new-folder.svg'
import { ReactComponent as ClearAllIcon } from '../../icons/clear-all.svg'
import { ReactComponent as VMIcon } from '../../icons/vm.svg'
import { ReactComponent as DesktopDownloadIcon } from '../../icons/desktop-download.svg'
import { ReactComponent as AddIcon } from '../../icons/add.svg'
import { ReactComponent as LinkIcon } from '../../icons/link.svg'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { ContextMenu, ContextMenuOptions } from '../ContextMenu'
import React from 'react'
import { NavLinkPersist } from '../../supports/Persistence'
// import { ALL_DATABASES, DirectoryNodeType, FileMetadata, FolderMetadata } from '../../../domain/entities/Directory'
import { Directory } from '../../../domain/entities/Directory'
import { useFileAdapter, useFolderAdapter } from '../../../adapters/DirectoryAdapter'
import { FolderStatus } from '../../../domain/repositories/DirectoryState'

export interface ExplorerProps {
  workspace: Pick<Directory.FolderMetadata, "parentId" | "id">
}

interface FolderProps {
  folder: Directory.FolderMetadata
  showContextMenu: (event: React.MouseEvent<Element, MouseEvent>, item: string | ContextMenuOptions) => void
}

interface FileProps {
  file: Directory.FileMetadata
  showContextMenu: (event: React.MouseEvent<Element, MouseEvent>, item: string | ContextMenuOptions) => void
}

interface ExplorerItemsProps {
  folder: Directory.FolderMetadata
  showContextMenu: (event: React.MouseEvent<Element, MouseEvent>, item: string | ContextMenuOptions) => void
}

const breadcrumbContextOptions: ContextMenuOptions = [
  { icon: LinkIcon, text: 'Copy Link' },
  null,
  { icon: LinkExternalIcon, text: 'Open in New Tab' },
  { icon: LinkExternalIcon, text: 'Open in Editor' },
]

const folderContextOptions: ContextMenuOptions = [
  { icon: RenameIcon, text: 'Rename Folder' },
  { icon: TrashIcon, text: 'Delete Folder' },
  null,
  { icon: LinkExternalIcon, text: 'Open Folder in Editor' },
]

const deviceExplorerContextOptions: ContextMenuOptions = [
  {
    icon: AddIcon,
    text: 'New Device'
  }
]

const deviceContextOptions: ContextMenuOptions = [
  {
    icon: ClearAllIcon,
    text: 'Format Device'
  },
  {
    icon: TrashIcon,
    text: 'Delete Device'
  },
  {
    icon: LinkExternalIcon,
    text: 'Open Device in Editor'
  }
]

export function Explorer({ workspace }: ExplorerProps) {

  const { createFolder, fetchFolderContent } = useFolderAdapter(workspace)
  const { createFile } = useFileAdapter(workspace)

  useEffect(fetchFolderContent, [])

  const [contextMenu, setContextMenu] = useState<ReactNode>()
  const containerRef = useRef(null)
  const itemsRef = useRef(null)
  const [key, setKey] = useState<number>(0)

  const createNewFile = async () => {
    const fileName = prompt('Enter File Name')
    if(fileName === null) return
    createFile({ name: fileName })
  }

  const createNewFolder = async () => {
    const folderName = prompt('Enter Folder Name')
    if(folderName === null) return
    createFolder({ name: folderName })
  }

  const itemsExplorerContextOptions: ContextMenuOptions = [
    { icon: NewFileIcon, text: 'New File', onClick: createNewFile },
    { icon: NewFolderIcon, text: 'New Folder', onClick: createNewFolder },
  ]

  const showContextMenu = (
    event: React.MouseEvent<Element, MouseEvent>,
    item: string | ContextMenuOptions
  ) => {
    event.preventDefault()
    if (item === 'items') {
      event.stopPropagation()
      const itemsElm: HTMLDivElement = itemsRef.current!
      if (event.pageY >= itemsElm.offsetTop)
        setContextMenu(<ContextMenu options={itemsExplorerContextOptions} hide={hideContextMenu} event={event} />)
    }
    else if (item === 'devices') {
      event.stopPropagation()
      const itemsElm: HTMLDivElement = itemsRef.current!
      if (event.pageY >= itemsElm.offsetTop)
        setContextMenu(<ContextMenu options={deviceExplorerContextOptions} hide={hideContextMenu} event={event} />)
    }
    else if (item === 'folder') {
      event.stopPropagation()
      setContextMenu(<ContextMenu options={folderContextOptions} hide={hideContextMenu} event={event} />)
    }
    else if (item === 'device') {
      event.stopPropagation()
      setContextMenu(<ContextMenu options={deviceContextOptions} hide={hideContextMenu} event={event} />)
    }
    else if (item === 'breadcrumb') {
      event.stopPropagation()
      setContextMenu(<ContextMenu options={breadcrumbContextOptions} hide={hideContextMenu} event={event} />)
    }
    else if(typeof item !== 'string') {
      event.stopPropagation()
      setContextMenu(<ContextMenu options={item} hide={hideContextMenu} event={event} />)
    }
    else {
      throw new Error('[Explorer] Context Type Not Found!!')
    }
  }

  const hideContextMenu = () => {
    setContextMenu(<></>)
  }

  return (<>
    {contextMenu}
    <div
      ref={containerRef}
      className={styles.container}
      onContextMenu={(event) => showContextMenu(event, itemsExplorerContextOptions)}>
      {/* <BreadCrumbs folder={workspace} showContextMenu={showContextMenu} /> */}
      <hr />
      <div ref={itemsRef} key={key}>
        <FolderItems folder={workspace} showContextMenu={showContextMenu} />
      </div>
    </div>
  </>)
}

// export function BreadCrumbs({ folder, showContextMenu }: ExplorerItemsProps) {

//   const [parents, setParents] = useState<Directory.FolderMetadata[]>([folder])
//   const [loading, setLoading] = useState<boolean>(true)

//   // useEffect(() => {
//   //   (async () => {
//   //     const parents: Directory.FolderMetadata[] = [folder]
//   //     let parent: Directory.FolderMetadata | null = folder
//   //     for (let i = 0; i < 3 && parent !== null; i++) {
//   //       parents.push(parent)
//   //       parent = await fileStorageInteractor.fetchParentMetadata(parent)
//   //     }
//   //     parents.reverse()
//   //     setParents(parents)
//   //     setLoading(false)
//   //   })()

//   // }, [folder.id])

//   if(loading) {
//     return (
//       <div>Loading...</div>
//     )
//   }

//   return (
//     <div className={styles.breadcrumbs}>
//       {
//         parents.map((folder, index) => <React.Fragment key={folder.id}>
//           <NavLinkPersist
//             to={`/explorer/${folder.id}`}
//             className={styles.breadcrumb}
//             onContextMenu={(event) => showContextMenu(event, 'breadcrumb')}
//           >
//             {folder.name}
//           </NavLinkPersist>
//           {index != parents.length - 1 ? <ChevronRightIcon /> : null}
//         </React.Fragment>)
//       }
//     </div>
//   )
// }

export function FolderItems({ folder, showContextMenu }: ExplorerItemsProps) {

  const { fetchFolderContent, folderContent, folderStatus } = useFolderAdapter(folder)

  const itemsRef = useRef(null)

  useEffect(fetchFolderContent, [folder.id])

  if(folderStatus === FolderStatus.ContentLoading || folderStatus === FolderStatus.Creating) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className={styles.items} ref={itemsRef}>
      {
        folderContent.length === 0 && <div className={styles.emptyFolderShowCase}>This Folder is Empty!</div>
      }
      {
        folderContent.map(item => {
          if (item.type === Directory.NodeType.folder) {
            return <Folder key={item.id} folder={item} showContextMenu={showContextMenu} />
          }
          else {
            return <File key={item.id} file={item} showContextMenu={showContextMenu} />
          }
        })
      }
    </div>
  )
}

export function File({ file, showContextMenu }: FileProps) {

  const { deleteFile } = useFileAdapter(file)
  
  const fileContextOptions: ContextMenuOptions = [
    { icon: RenameIcon, text: 'Rename File' },
    { icon: TrashIcon, text: 'Delete File', onClick: deleteFile },
    null,
    { icon: DesktopDownloadIcon, text: 'Download File' },
  ]

  return (
    <NavLinkPersist
      to={`/editor/${file.id}`}
      className={styles.item}
      onContextMenu={(event) => showContextMenu(event, fileContextOptions)}
    >
      <FileIcon />
      {`${file.name}`}
    </NavLinkPersist>
  )
}

export function Folder({ folder, showContextMenu }: FolderProps) {

  const { deleteFolder } = useFolderAdapter(folder)

  const folderContextOptions: ContextMenuOptions = [
    { icon: RenameIcon, text: 'Rename Folder' },
    { icon: TrashIcon, text: 'Delete Folder', onClick: deleteFolder },
    null,
    { icon: LinkExternalIcon, text: 'Open Folder in Editor' },
  ]

  return (<>
    <NavLinkPersist
      to={`/explorer/${folder.parentId}/${folder.id}`}
      className={styles.item}
      onContextMenu={(event) => showContextMenu(event, folderContextOptions)}>
      {folder.id === 'root' ? <VMIcon /> : <FolderIcon />}
      {folder.name}
    </NavLinkPersist>
  </>)
}
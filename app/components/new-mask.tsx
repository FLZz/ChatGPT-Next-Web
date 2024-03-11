import { IconButton } from "./button";
import { ErrorBoundary } from "./error";

import styles from "./new-mask.module.scss";

import DownloadIcon from "../icons/download.svg";
import UploadIcon from "../icons/upload.svg";
import EditIcon from "../icons/edit-w.svg";
import AddIcon from "../icons/chat-w.svg";
import CloseIcon from "../icons/close.svg";
import DeleteIcon from "../icons/delete.svg";
import EyeIcon from "../icons/eye.svg";
import CopyIcon from "../icons/copy.svg";
import DragIcon from "../icons/drag.svg";

import { DEFAULT_MASK_AVATAR, Mask, useMaskStore } from "../store/mask";
import {
  ChatMessage,
  createMessage,
  ModelConfig,
  ModelType,
  useAppConfig,
  useChatStore,
} from "../store";
import { MultimodalContent, ROLES } from "../client/api";
import {
  Input,
  List,
  ListItem,
  Modal,
  Popover,
  Select,
  showConfirm,
} from "./ui-lib";
import { Avatar, AvatarPicker } from "./emoji";
import Locale, { AllLangs, ALL_LANG_OPTIONS, Lang } from "../locales";
import { useNavigate } from "react-router-dom";

import chatStyle from "./chat.module.scss";
import { useEffect, useState } from "react";
import {
  copyToClipboard,
  downloadAs,
  getMessageImages,
  readFromFile,
} from "../utils";
import { Updater } from "../typing";
import { ModelConfigList } from "./model-config";
import { FileName, Path } from "../constant";
import { BUILTIN_MASK_STORE } from "../masks";
import { nanoid } from "nanoid";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { getMessageTextContent } from "../utils";

export function NewMaskPage() {
  const navigate = useNavigate();

  const maskStore = useMaskStore();
  const chatStore = useChatStore();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [promptObj, setPromptObj] = useState<any>({});
  const [filterLang, setFilterLang] = useState<Lang>();

  const [editingMaskId, setEditingMaskId] = useState<string | undefined>();
  const editingMask =
    maskStore.get(editingMaskId) ?? BUILTIN_MASK_STORE.get(editingMaskId);
  const closeMaskModal = () => setEditingMaskId(undefined);

  const allMasks = maskStore
    .getAll()
    .filter((m) => !filterLang || m.lang === filterLang);

  return (
    <ErrorBoundary>
      <div className={styles["new-mask-page"]}>
        <div className={styles["new-mask-page-title"]}>常用规划prompt</div>
        <div className={styles["new-mask-page-container"]}>
          {allMasks.map((m) => {
            return (
              <div
                key={m.id}
                className={styles["new-mask-page-container-item"]}
              >
                <div className={styles["new-mask-page-container-item-title"]}>
                  {m.name}
                </div>
                <p className={styles["new-mask-page-container-item-text"]}>
                  {m.describe}
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  {/* <IconButton
                  icon={<AddIcon />}
                  text={'尝试使用'}
                  bordered
                  className={styles["button"]}
                  onClick={() => {
                    chatStore.newSession(m);
                    navigate(Path.Chat);
                  }}
                /> */}
                  <IconButton
                    icon={<EyeIcon />}
                    text={"查 看"}
                    type="primary"
                    bordered
                    className={styles["button"]}
                    onClick={() => setEditingMaskId(m.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingMask && (
        <div className="modal-mask">
          <Modal
            title={Locale.Mask.EditModal.Title(editingMask?.builtin)}
            onClose={closeMaskModal}
            actions={[
              // <IconButton
              //   icon={<DownloadIcon />}
              //   text={Locale.Mask.EditModal.Download}
              //   key="export"
              //   bordered
              //   onClick={() =>
              //     downloadAs(
              //       JSON.stringify(editingMask),
              //       `${editingMask.name}.json`,
              //     )
              //   }
              // />,
              // <IconButton
              //   key="copy"
              //   icon={<CopyIcon />}
              //   bordered
              //   text={'保存'}
              //   onClick={() => {
              //     navigate(Path.NewMasks);
              //     maskStore.save(editingMask.id, {...editingMask, ...promptObj});
              //     setEditingMaskId(undefined);
              //   }}
              // />,
              <IconButton
                key="copy"
                icon={<AddIcon />}
                text={"尝试使用"}
                bordered
                type="primary"
                onClick={() => {
                  chatStore.newSession(editingMask);
                  navigate(Path.Chat);
                }}
              />,
            ]}
          >
            <div className={styles["input-container"]}>
              <span className={styles["input-container-label"]}>
                prompt标题:
              </span>
              <input
                type="text"
                defaultValue={editingMask.name}
                readOnly
                onInput={(e) => {
                  setTitle(e.currentTarget.value);
                  setPromptObj({ ...editingMask, name: e.currentTarget.value });
                }}
              ></input>
            </div>

            <div
              className={styles["input-container"]}
              style={{ marginTop: "10px" }}
            >
              <span className={styles["input-container-label"]}>
                prompt内容: (
                <span style={{ color: "#555" }}>请保留$$, &&占位符</span>){" "}
              </span>
              <Input
                defaultValue={
                  (editingMask.context &&
                    editingMask.context[1].content) as string
                }
                type="text"
                readOnly
                className={styles["context-content"]}
                rows={16}
                onInput={(e) => {
                  setContent(e.currentTarget.value);
                  let a = JSON.parse(JSON.stringify(editingMask));
                  a.context[1] = {
                    ...a.context[1],
                    content: e.currentTarget.value,
                  };

                  setPromptObj(a);
                }}
              />
            </div>
          </Modal>
        </div>
      )}
    </ErrorBoundary>
  );
}

// maskStore.updateMask(editingMaskId!, (mask) => {
//   mask.name = e.currentTarget.value;
// })
// maskStore.updateMask(editingMaskId!, (mask) => {
//   if (mask.context) {
//     mask.context[0] = {...mask.context[0], content: e.currentTarget.value as any}
//   }
// })

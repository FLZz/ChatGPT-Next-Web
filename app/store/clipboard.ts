import {
  StoreKey,
} from "../constant";
import { createPersistStore } from "../utils/store";


export const useClipboardList = createPersistStore(
  { data: <any>[] },
  (set, get) => ({
    reset() {
      set(() => ({ data: [] }));
    },
    del(str: string) {
        set((state) => {
            return {
                data: state.data.filter( (item: any) => item.text !== str )
            }
        })
    }
  }),
  {
    name: StoreKey.ClipboardList,
    version: 1
  },
);

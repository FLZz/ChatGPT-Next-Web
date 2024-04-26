import { StoreKey } from "../constant";
import { createPersistStore } from "../utils/store";

export const useClipboardList = createPersistStore(
  { data: <any>[] },
  (set, get) => ({
    reset() {
      set(() => ({ data: [] }));
    },
    del(str: string) {
      set((state) => {
        console.log(state.data.filter((item: any) => item.content !== str));
        return {
          data: state.data.filter((item: any) => item.content !== str),
        };
      });
    },
  }),
  {
    name: StoreKey.ClipboardList,
    version: 1,
  },
);

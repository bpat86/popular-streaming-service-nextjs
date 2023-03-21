import axios from "axios";
import produce from "immer";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

import { NEXT_URL } from "@/config";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface IProfileAttributes {
  name: string | null;
  avatar: string;
  kid: boolean;
  autoPlayNextEpisode: boolean;
  autoPlayPreviews: boolean;
}

interface IProfile {
  id: string | null;
  attributes: IProfileAttributes;
}

interface IProfileStore {
  addProfileModeEnabled: boolean;
  editModeEnabled: boolean;
  manageProfilesModeEnabled: boolean;
  promptSelectAvatar: boolean;
  promptConfirmAvatar: boolean;
  promptConfirmDeleteProfile: boolean;
  profileAttributes: IProfileAttributes;
  profiles: IProfile[];
  activeProfile: IProfile | null;
  editableProfile: IProfile | null;
  toggleAddProfileMode: () => void;
  toggleEditMode: () => void;
  toggleManageProfilesMode: () => void;
  togglePromptSelectAvatar: () => void;
  togglePromptConfirmAvatar: () => void;
  togglePromptConfirmDeleteProfile: () => void;
  toggleAll: () => void; // Toggles all modes off
  resetProfile: () => void;
  setProfileAttributes: (profileAttributes: IProfileAttributes) => void;
  setProfiles: (profiles: IProfile[]) => void;
  setProfileAvatar: (avatar: IProfileAttributes["avatar"]) => void;
  setActiveProfile: (profile: IProfile) => void;
  setEditableProfile: (profile: IProfile) => void;
  getSessionStorage: () => void;
  createProfile: (profile: IProfileAttributes) => void;
  updateProfile: (profile: IProfile) => void;
  deleteProfile: (id: IProfile["id"]) => void;
}

const profileAttributes: IProfileAttributes = {
  name: null,
  avatar: "yellow",
  kid: false,
  autoPlayNextEpisode: true,
  autoPlayPreviews: true,
};

const initialProfile: IProfile = {
  id: null,
  attributes: profileAttributes,
};

const useProfileStore = create(
  persist<IProfileStore>(
    (set, get) => ({
      addProfileModeEnabled: false,
      toggleAddProfileMode: () =>
        set((state) => ({
          addProfileModeEnabled: !state.addProfileModeEnabled,
        })),
      editModeEnabled: false,
      toggleEditMode: () =>
        set((state) => ({ editModeEnabled: !state.editModeEnabled })),
      manageProfilesModeEnabled: false,
      toggleManageProfilesMode: () => {
        Cookies.remove("activeProfile");
        sessionStorage.removeItem("activeProfile");
        set((state) => ({
          activeProfile: null,
          manageProfilesModeEnabled: !state.manageProfilesModeEnabled,
        }));
      },
      promptSelectAvatar: false,
      togglePromptSelectAvatar: () =>
        set((state) => ({
          promptSelectAvatar: !state.promptSelectAvatar,
        })),
      promptConfirmAvatar: false,
      togglePromptConfirmAvatar: () => {
        set((state) => ({
          promptConfirmAvatar: !state.promptConfirmAvatar,
        }));
      },
      promptConfirmDeleteProfile: false,
      togglePromptConfirmDeleteProfile: () => {
        set((state) => ({
          promptConfirmDeleteProfile: !state.promptConfirmDeleteProfile,
        }));
      },
      toggleAll: () => {
        set(() => ({
          addProfileModeEnabled: false,
          editModeEnabled: false,
          manageProfilesModeEnabled: false,
          promptSelectAvatar: false,
        }));
      },
      profileAttributes,
      profiles: [],
      activeProfile: null,
      editableProfile: null,
      resetProfile: () => set({ profileAttributes }),
      setProfileAttributes: (profileAttributes: IProfileAttributes) => {
        set(
          produce((state) => {
            state.profileAttributes = profileAttributes;
            state.profile = {
              ...state.profile,
              attributes: profileAttributes,
            };
          })
        );
      },
      setProfiles: (profiles: IProfile[]) => {
        set(
          produce((state) => {
            state.profiles = profiles;
          })
        );
      },
      setProfileAvatar: (avatar: IProfileAttributes["avatar"]) => {
        set(
          produce((state) => {
            state.profile.avatar = avatar;
          })
        );
      },
      setActiveProfile: (profile: IProfile) => {
        // Save the selected profile id to cookies
        profile.id && Cookies.remove("activeProfile");
        profile.id && Cookies.set("activeProfile", profile.id); // { expires: 7 }
        // Save the selected profile to session storage
        sessionStorage.removeItem("activeProfile");
        sessionStorage.setItem("activeProfile", JSON.stringify(profile));
        set(
          produce((state) => {
            state.activeProfile = profile;
            state.editableProfile = initialProfile;
          })
        );
        mutate("/api/strapi/users/me");
        mutate("/api/strapi/profiles/myProfile");
      },
      setEditableProfile: (profile: IProfile) => {
        set(
          produce((state) => {
            state.editableProfile = profile;
          })
        );
      },
      getSessionStorage: () => {
        const session = sessionStorage.getItem("activeProfile");
        const profile = session ? JSON.parse(session) : "";
        // If session exists, save the selected profile to state
        if (profile) {
          set(
            produce((state) => {
              state.activeProfile = profile;
            })
          );
        }
      },
      createProfile: async (profile: IProfileAttributes) => {
        const url = `${NEXT_URL}/api/strapi/profiles/createProfile`;
        try {
          const response = await axios.post(url, profile);
          set({
            profileAttributes: await response.data.profile.attributes,
            editableProfile: await response.data.profile,
            profiles: [...get().profiles, response.data.profile],
          });
          if (response.status === 200) {
            await sleep(1000);
            toast.success("Profile created successfully.");
            return response.data.profile;
          }
        } catch (e: any) {
          await sleep(1000);
          toast.error("Something with wrong.");
        }
      },
      updateProfile: async (profile: IProfile) => {
        const url = `${NEXT_URL}/api/strapi/profiles/editProfile`;
        try {
          const response = await axios.put(url, profile);
          set({
            profileAttributes: await response.data.profile.attributes,
            editableProfile: await response.data.profile,
            profiles: [...get().profiles, response.data.profile],
          });
          if (response.status === 200) {
            await sleep(1000);
            toast.success("Profile updated successfully.");
            return response.data.profile;
          }
        } catch (e: any) {
          await sleep(1000);
          toast.error("Something with wrong.");
        }
      },
      deleteProfile: async (id: IProfile["id"]) => {
        const url = `${NEXT_URL}/api/strapi/profiles/deleteProfile`;
        try {
          const response = await axios.delete(url, { data: { id } });
          set({
            profileAttributes,
            profiles: get().profiles.filter((profile) => profile.id !== id),
          });
          if (response.status === 200) {
            await sleep(1000);
            toast.success("Profile deleted successfully.");
            return response.data.profile;
          }
        } catch (e: any) {
          await sleep(1000);
          toast.error("Something with wrong.");
        }
      },
    }),
    {
      name: "active-profile", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ...state.editableProfile }),
    } as PersistOptions<IProfileStore>
  )
);

export default useProfileStore;

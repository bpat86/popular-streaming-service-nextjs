import { shallow } from "zustand/shallow";

import { IUser } from "@/pages/api/strapi/users/types";
import useProfileStore from "@/store/ProfileStore";
import { IProfile } from "@/store/types";

import AddProfile from "./profiles/actions/AddProfile";
import EditProfile from "./profiles/actions/EditProfile";
import WhosWatching from "./profiles/WhosWatching";

type ProfileGateProps = {
  user: IUser;
  profiles: IProfile[];
  mutate: any;
  error: any;
  isLoading: boolean;
  isValidating: boolean;
};

export default function ProfileGate({
  user,
  profiles,
  error,
  mutate,
  isLoading,
  isValidating,
}: ProfileGateProps) {
  const { addProfileModeEnabled, editModeEnabled } = useProfileStore(
    (state) => ({
      addProfileModeEnabled: state.addProfileModeEnabled,
      editModeEnabled: state.editModeEnabled,
    }),
    shallow
  );

  // Add profile mode (create new profile)
  if (addProfileModeEnabled) {
    return (
      <AddProfile
        {...{ user, profiles, error, mutate, isLoading, isValidating }}
      />
    );
  }

  // Edit profile mode (edit existing profile)
  if (editModeEnabled) {
    return (
      <EditProfile
        {...{ user, profiles, error, mutate, isLoading, isValidating }}
      />
    );
  }

  // Default view (list of profiles)
  return (
    <WhosWatching
      {...{ user, profiles, error, mutate, isLoading, isValidating }}
    />
  );
}

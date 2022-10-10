import { useContext } from "react";

import WhosWatching from "./WhosWatching";
import EditProfile from "./actions/EditProfile";
import AddNewProfile from "./actions/AddNewProfile";

import ProfileContext from "@/context/ProfileContext";
import useProfiles from "@/middleware/useProfiles";

const UserProfiles = ({ user }) => {
  const { profiles, profileNames, mutateProfiles, loadingProfiles, config } =
    useProfiles({ user });
  const { addNewProfile, editProfile } = useContext(ProfileContext);

  return (
    <>
      {addNewProfile ? (
        <AddNewProfile
          config={config}
          profiles={profiles}
          profileNames={profileNames}
          loadingProfiles={loadingProfiles}
          title="Add a Profile"
          user={user}
        />
      ) : editProfile ? (
        <EditProfile
          config={config}
          profiles={profiles}
          profileNames={profileNames}
          loadingProfiles={loadingProfiles}
          title="Edit Profile"
          user={user}
        />
      ) : (
        <WhosWatching
          config={config}
          profiles={profiles}
          profileNames={profileNames}
          mutateProfiles={mutateProfiles}
          loadingProfiles={loadingProfiles}
          title="Netflix"
          user={user}
        />
      )}
    </>
  );
};

export default UserProfiles;

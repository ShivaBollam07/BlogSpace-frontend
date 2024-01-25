// UserCard.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../components/loader.component';
import NoDataMessage from '../components/nodata.component';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ users }) => {
  const navigate = useNavigate();

  const navigateToUserProfile = (username) => {
    navigate(`/user/${username}`);
  };

  return (
    <>
      {users === null ? (
        <Loader />
      ) : users.length ? (
        <div className="flex flex-col gap-4">
          {users.map((user, i) => (
            <div
              key={i}
              className="flex items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => navigateToUserProfile(user?.personal_info?.username)}
            >
              <img
                src={user?.personal_info?.profile_img}
                alt={user?.personal_info?.username}
                className="w-16 h-16 rounded-full mr-2"
              />
              <div>
                <p className="font-semibold">{user?.personal_info?.username}</p>
                <p className="text-sm text-dark-grey ml-2">{user?.personal_info?.fullname}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoDataMessage message="No users found" />
      )}
    </>
  );
};

UserCard.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UserCard;

import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { selectUpdateUserError, selectUser } from '../../services/selectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUpdateUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    Boolean(formValue.password);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const changedData: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (formValue.name !== user?.name) changedData.name = formValue.name;
    if (formValue.email !== user?.email) changedData.email = formValue.email;
    if (formValue.password) changedData.password = formValue.password;

    dispatch(updateUser(changedData))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch(() => undefined);
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

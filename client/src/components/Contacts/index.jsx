import React from 'react';
import './contacts.css';
import CreateContactModal from './CreateContactModal';
import DeleteContactModal from './DeleteContactModal';
import ContactsList from './ContactsList';
import PreviewContact from './PreviewContact';
import { ContactsContext } from 'contexts';
import EditFieldModal from './EditFieldModal';

const Contacts = () => (
  <ContactsContext.Consumer>
    {({ state }) => (
      <section
        className={
          state.isPreviewing ? 'contacts-main split-2' : 'contacts-main'
        }
      >
        <CreateContactModal />
        <DeleteContactModal />
        <EditFieldModal />
        <ContactsList />
        {state.isPreviewing ? (
          <PreviewContact contact={state.isPreviewing} />
        ) : null}
      </section>
    )}
  </ContactsContext.Consumer>
);

export default Contacts;

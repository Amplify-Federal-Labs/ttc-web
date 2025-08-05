'use client';
import { DataSourceCache } from '@toolpad/core/Crud';
import type { DataModel, DataSource } from '@toolpad/core/Crud';
import { z } from 'zod';

export interface Contact extends DataModel {
  id: number;
  name: string;
  age: number;
  birthDate: Date;
}

const INITIAL_CONTACT_STORE: Contact[] = [
  {
    id: 1,
    name: 'Edward Perry',
    age: 25,
    birthDate: new Date(),
  },
  {
    id: 2,
    name: 'Josephine Drake',
    age: 36,
    birthDate: new Date(),
  },
  {
    id: 3,
    name: 'Cody Phillips',
    age: 19,
    birthDate: new Date(),
  },
];

const getContactsStore = (): Contact[] => {
  const value = localStorage.getItem('contacts-store');
  return value ? JSON.parse(value) : INITIAL_CONTACT_STORE;
};

const setContactsStore = (value: Contact[]) => {
  return localStorage.setItem('contacts-store', JSON.stringify(value));
};

export const contactsDataSource: DataSource<Contact> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 140 },
    { field: 'age', headerName: 'Age', type: 'number' },
    {
      field: 'birthDate',
      headerName: 'Birth date',
      type: 'date',
      valueGetter: (value) => value && new Date(value),
      width: 140,
    },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    const employeesStore = getContactsStore();

    let filteredContacts = [...employeesStore];

    // Apply filters (example only)
    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) {
          return;
        }

        filteredContacts = filteredContacts.filter((contact) => {
          const contactValue = contact[field];

          switch (operator) {
            case 'contains':
              return String(contactValue).toLowerCase().includes(String(value).toLowerCase());
            case 'equals':
              return contactValue === value;
            case 'startsWith':
              return String(contactValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(contactValue).toLowerCase().endsWith(String(value).toLowerCase());
            case '>':
              return (contactValue as number) > value;
            case '<':
              return (contactValue as number) < value;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sortModel?.length) {
      filteredContacts.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if ((a[field] as number) < (b[field] as number)) {
            return sort === 'asc' ? -1 : 1;
          }
          if ((a[field] as number) > (b[field] as number)) {
            return sort === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }

    // Apply pagination
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedContacts = filteredContacts.slice(start, end);

    return {
      items: paginatedContacts,
      itemCount: filteredContacts.length,
    };
  },
  getOne: async (contactId) => {
    const contactsStore = getContactsStore();

    const contactToShow = contactsStore.find((employee) => employee.id === Number(contactId));

    if (!contactToShow) {
      throw new Error('Contact not found');
    }
    return contactToShow;
  },
  createOne: async (data) => {
    const contactsStore = getContactsStore();

    const newContact = {
      id: contactsStore.reduce((max, contact) => Math.max(max, contact.id), 0) + 1,
      ...data,
    } as Contact;

    setContactsStore([...contactsStore, newContact]);

    return newContact;
  },
  updateOne: async (contactId, data) => {
    const contactsStore = getContactsStore();

    let updatedContact: Contact | null = null;

    setContactsStore(
      contactsStore.map((contact) => {
        if (contact.id === Number(contactId)) {
          updatedContact = { ...contact, ...data };
          return updatedContact;
        }
        return contact;
      }),
    );

    if (!updatedContact) {
      throw new Error('Employee not found');
    }
    return updatedContact;
  },
  deleteOne: async (contactId) => {
    const contactsStore = getContactsStore();

    setContactsStore(contactsStore.filter((contact) => contact.id !== Number(contactId)));
  },
  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    age: z.number({ required_error: 'Age is required' }).min(18, 'Age must be at least 18'),
    birthDate: z
      .string({ required_error: 'Birth date is required' })
      .nonempty('Birth date is required'),
  })['~standard'].validate,
};

export const contactsCache = new DataSourceCache();

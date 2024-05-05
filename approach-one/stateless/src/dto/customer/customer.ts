type Address = {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

type Membership = {
  status: 'active' | 'inactive';
  since?: string;
};

export type Customer = {
  id: string;
  created: string;
  name: string;
  email: string;
  phone?: string;
  address: Address;
  membership?: Membership;
};

export type CreateCustomer = {
  name: string;
  email: string;
  phone?: string;
  address: Address;
  membership?: Membership;
};

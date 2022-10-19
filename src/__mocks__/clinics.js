import { v4 as uuid } from 'uuid';

export const clinics = [
  {
    id: uuid(),
    createdAt: '27/03/2019',
	  name: 'Clinica Teste',
    description: 'Odontologia',
    media: '/static/images/products/product_1.png',
    address: {
        
    },
	  phone: '(51) 99999-9999',	
	  email: 'clinica@teste.com',
	
  },
];
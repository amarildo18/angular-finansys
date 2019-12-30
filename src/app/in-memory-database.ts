import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {

  createDb() {

    const categories: Category[] = [
      {id: 1, name: 'Moradia', description: 'Pagamentos de contas da casa'},
      {id: 2, name: 'Saude', description: 'Plano de saude e remedios'},
      {id: 3, name: 'Lazer', description: 'Cinema, Parques, Praia, etc'},
      {id: 4, name: 'Salario', description: 'Recebimento de salarios'},
      {id: 5, name: 'Freela', description: 'Trabalhos de Freelance'}
    ];

    const entries: Entry[] = [

      {
        id: 1,
        name: 'Gas de cozinha',
        description: 'descricao da despesa',
        type: 'expense',
        amount: '70,80',
        date: '14/02/2018',
        paid: false,
        categoryId: categories[0].id,
        category: categories[0]
      } as Entry,

      {
        id: 2,
        name: 'Suplementos',
        description: 'descricao dos suplementos',
        type: 'expense',
        amount: '80,90',
        date: '14/10/2019',
        paid: true,
        categoryId: categories[1].id,
        category: categories[1]
      } as Entry,

      {
        id: 3,
        name: 'Pagamento de Impostos',
        description: 'descricao do pagamento',
        type: 'revenue',
        amount: '80,90',
        date: '14/10/2019',
        paid: true,
        categoryId: categories[2].id,
        category: categories[2]
      } as Entry
    ];

    return { categories, entries };
  }

}

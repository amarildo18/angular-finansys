import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';

export class InMemoryDatabase implements InMemoryDbService {

  createDb() {

    const categories: Category[] = [
      {id: 1, name: 'Moradia', description: 'Pagamentos de contas da casa'},
      {id: 2, name: 'Saude', description: 'Plano de saude e remedios'},
      {id: 3, name: 'Lazer', description: 'Cinema, Parques, Praia, etc'},
      {id: 4, name: 'Salario', description: 'Recebimento de salarios'},
      {id: 5, name: 'Freela', description: 'Trabalhos de Freelance'}
    ];

    return { categories };
  }

}


import { Component, OnInit } from '@angular/core';

import { Category } from '../shared/category.model';
import { CategoryService } from './../shared/category.service';
import { error, element } from 'protractor';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {

    this.categoryService.getAll().subscribe(
        response => this.categories = response
    );
  }

  deleteCategory( category: Category): void {

    const mustDelete = confirm('Deseja realmente remover este item ?');
    if ( mustDelete) {

      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter( element => element !== category),
        () => alert('Erro ao excluir')
      );
    }

  }

}

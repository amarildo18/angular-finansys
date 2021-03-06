
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';

import { Entry } from '../shared/entry.model';
import { EntryService } from './../shared/entry.service';

import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submitingForm = false;
  entry: Entry = new Entry();
  categories: Category[];

  imageChangedEvent: any = '';
  croppedImage: any = '';

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptAO = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShorts: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul','Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    private entryService: EntryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {

    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();

  }

  submitForm() {

    this.submitingForm = true;

    if ( this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  ngAfterContentChecked() {

    this.setPageTitle();
  }

  public get typeOfActions(): Array<any> {

    return Object.entries(Entry.types).map(
      ([value, text]) => {

        return {
          texto: text,
          valor: value
        };

      }
    );
  }

  // declaracao dos metodos privados

  private setCurrentAction() {

    if ( this.route.snapshot.url[0].path === 'new' ) {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }

  } // fim do setCurrentAction

  private buildEntryForm() {

    this.entryForm = this.formBuilder.group({
      id: [null] ,
      name: [ null, [Validators.required, Validators.minLength(2)] ],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });

  }

  private loadEntry() {

    if ( this.currentAction === 'edit') {

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe (
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue( this.entry );
        }
      );
    }
  }

  private loadCategories() {

    this.categoryService.getAll().subscribe(
      entries => this.categories = entries
    );
  }

  private setPageTitle() {
    if ( this.currentAction === 'new') {
      this.pageTitle = 'Cadastrando novo lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando o lançamento: ' + entryName;
    }
  }

  private createEntry() {

    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create( entry).subscribe(
      entry => this.actionsForSuccess( entry ),
      error => this.actionsForError( error )
    );
  }

  private updateEntry() {
    const entry: Entry = Object.assign( new Entry(), this.entryForm.value);
    this.entryService.update(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError( error )
    );
  }

  private actionsForSuccess(entry: Entry) {

    this.toastr.success('solicitacao processada com sucesso');
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }

  private actionsForError(error) {

    this.toastr.error('Nao foi possivel processar a sua solicitacao! ');
    this.submitingForm = false;

    if ( error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['erro na comunicacao com o servidor, tente mais tarde'];
    }
  }

  // Metodos para cropper

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

}

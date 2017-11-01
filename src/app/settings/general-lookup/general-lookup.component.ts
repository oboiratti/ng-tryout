import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { LookUps, SettingsService } from '../settings.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageDialog } from '../../shared/message_helper';

@Component({
  selector: 'app-general-lookup',
  templateUrl: './general-lookup.component.html',
  styleUrls: ['./general-lookup.component.css']
})
export class GeneralLookupComponent implements OnInit {

  title: string;
  modelName: string;
  model: any;
  showForm: boolean;
  formGroup: FormGroup
  records: any;
  record: any;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  selectedRecord: any;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private settingsService: SettingsService) {
    this.formGroup = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      notes: new FormControl('')
    });
  }

  ngOnInit() {
    this.modelName = this.activatedRoute.snapshot.paramMap.get('model');
    this.model = LookUps.models.find(model => model.name === this.modelName)
    this.fetchRecords();
  }

  openForm() {
    this.title = "New " + this.model.label;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.formGroup.reset();
  }

  onRowSelect(event) {
    
  }

  save() {
    this.record = this.formGroup.value;
    this.saving = true;
    this.settingsService.save(this.modelName, this.record).subscribe((res) => {
      this.saving = false;
      if (res.success) {
        this.showForm = false;
        this.formGroup.reset();
        this.fetchRecords();
      }
    }, err => {
      this.saving = false;
      console.log("Error -> " + err.message);
    });
  }

  remove(id: number) {
    MessageDialog.confirm("Delete Item", "Are you sure you want to delete this item").then((yes) => {
      if (yes) {
        this.deleting = true;
        this.settingsService.destroy(this.modelName, id).subscribe((res) => {
          this.deleting = false;
          if (res.success) {
            this.showForm = false;
            this.formGroup.reset();
            this.fetchRecords();
          }
        }, err => {
          this.deleting = false;
          console.log("Error -> " + err.message);
        });
      }
    }).catch((err) => {});
  }

  private fetchRecords() {
    this.loading = true;
    this.settingsService.fetch(this.model.name).subscribe((res) => {
      this.loading = false;
      if (res.success) {
        this.records = res.data;
      }
    });
  }

}

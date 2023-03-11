import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ChecklistService } from "@quicklist-signals/shared/data-access";
import { ChecklistItem } from "@quicklist-signals/shared/interfaces";
import {
  FormModalComponent,
  ModalComponent,
} from "@quicklist-signals/shared/ui";
import { ChecklistItemService } from "@quicklist-signals/checklist/data-access";
import {
  ChecklistItemHeaderComponent,
  ChecklistItemListComponent,
} from "@quicklist-signals/checklist/ui";

// DO NOT USE THIS - this is just a temporary example
// until the real fromObservable is implemented by Angular
const fromObservable = (obs$: Observable<any>) => {
  const signalRef = signal<any>(null);

  // designed for maximum memory leaks
  obs$.subscribe((value) => signalRef.set(value));

  return signalRef;
};

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ChecklistItemHeaderComponent,
    ChecklistItemListComponent,
    ModalComponent,
    FormModalComponent,
  ],
  selector: "app-checklist",
  template: `
    <app-checklist-item-header
      [checklist]="checklist()"
      (addItem)="formModalIsOpen.set(true)"
      (resetChecklist)="resetChecklistItems($event)"
    />

    <app-checklist-item-list
      [checklistItems]="items()"
      (toggle)="toggleChecklistItem($event)"
      (delete)="deleteChecklistItem($event)"
      (edit)="openEditModal($event)"
    />

    <app-modal [isOpen]="formModalIsOpen()">
      <ng-template>
        <app-form-modal
          [title]="checklistItemIdBeingEdited() ? 'Edit Item' : 'Create item'"
          [formGroup]="checklistItemForm"
          (close)="dismissModal()"
          (save)="
            checklistItemIdBeingEdited()
              ? editChecklistItem(checklistItemIdBeingEdited()!)
              : addChecklistItem(checklist().id)
          "
        ></app-form-modal>
      </ng-template>
    </app-modal>
  `,
})
export default class ChecklistComponent {
  checklistItemForm = this.fb.nonNullable.group({
    title: ["", Validators.required],
  });

  formModalIsOpen = signal(false);
  checklistItemIdBeingEdited = signal<string | null>(null);

  params = fromObservable(this.route.paramMap);

  checklist = this.checklistService.getChecklistById(this.params().get("id"));
  items = this.checklistItemService.getItemsByChecklistId(
    this.params().get("id")
  );

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService
  ) {}

  dismissModal() {
    this.formModalIsOpen.set(false);
    this.checklistItemIdBeingEdited.set(null);
  }

  addChecklistItem(checklistId: string) {
    this.checklistItemService.add(
      this.checklistItemForm.getRawValue(),
      checklistId
    );
  }

  editChecklistItem(checklistItemId: string) {
    this.checklistItemService.update(
      checklistItemId,
      this.checklistItemForm.getRawValue()
    );
  }

  openEditModal(checklistItem: ChecklistItem) {
    this.checklistItemForm.patchValue({
      title: checklistItem.title,
    });
    this.checklistItemIdBeingEdited.set(checklistItem.id);
    this.formModalIsOpen.set(true);
  }

  toggleChecklistItem(itemId: string) {
    this.checklistItemService.toggle(itemId);
  }

  resetChecklistItems(checklistId: string) {
    this.checklistItemService.reset(checklistId);
  }

  deleteChecklistItem(id: string) {
    this.checklistItemService.remove(id);
  }
}

import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ChecklistItemService } from "@quicklist-signals/checklist/data-access";
import { ChecklistService } from "@quicklist-signals/shared/data-access";

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: "app-root",
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit {
  constructor(
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService
  ) {}

  ngOnInit() {
    this.checklistService.load();
    this.checklistItemService.load();
  }
}

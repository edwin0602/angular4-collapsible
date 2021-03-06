import {
    Component,
    OnInit, AfterViewInit,
    Input,
    ViewChildren, QueryList
} from '@angular/core';

import { CollapsibleBodyComponent } from './collapsible-body.component';

import { CollapsibleService } from './collapsible.service';

import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'collapsible-table-row-detail',
    template: `
        <td colspan="100%">
            <collapsible-list-item>
                <collapsible-body>
                    <ng-content></ng-content>
                </collapsible-body>
            </collapsible-list-item>
        </td>
    `,
    styles: [`
        :host {
            display: table-row;
        }
        
        :host collapsible-body,
        :host td {
            padding: 0;
        }
    `]
})
export class CollapsibleTableRowDetailComponent implements OnInit, AfterViewInit {
    subject: Subject<any> = new Subject<any>();

    @Input() expanded: boolean;

    @ViewChildren(CollapsibleBodyComponent) viewListBodies: QueryList<CollapsibleBodyComponent>;

    constructor(private collapsibleService: CollapsibleService) { }

    ngOnInit() {
        this.subject.asObservable().subscribe(() => {
            this.viewListBodies.forEach((item) => {
                item.toggleCollapsibleItem();
            });
        });
    }

    ngAfterViewInit() {
        // store list bodies in 'CollapsibleService'
        this.viewListBodies.forEach((item) => {
            this.collapsibleService.addListBody(item);
        });
    }
}

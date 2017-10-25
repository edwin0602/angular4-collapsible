import {
    Component,
    OnInit, OnDestroy, OnChanges,
    Input, HostBinding,
    ElementRef,
    SimpleChanges
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { CollapsibleService } from './collapsible.service';
import { CollapsibleEventService } from './collapsible-event.service';
import { CollapsibleAnimationsService } from './collapsible-animations.service';

@Component({
    selector: 'collapsible-body',
    template: `<ng-content></ng-content>`,
    styles: [`
        :host {
            display: block;
            border-bottom: 1px solid #ddd;
            box-sizing: border-box;
            padding: 2rem;
        }

        .side-nav :host {
            padding: 0;
        }

        .side-nav :host,
        .side-nav.fixed :host {
            border: 0;
            background-color: #fff;
        }
    `],
    animations: CollapsibleAnimationsService.collapsibleBodyAnimations('collapsibleBodyState')
})
export class CollapsibleBodyComponent implements OnInit, OnChanges, OnDestroy {
    @HostBinding('@collapsibleBodyState')
    expandedState: string;

    @Input() expanded: boolean;

    constructor(
        private el: ElementRef,
        private collapsibleService: CollapsibleService,
        private eventService: CollapsibleEventService) { }

    ngOnInit() {
        // console.debug('CollapsibleBody::ngOnInit()');
        this.eventService.toggleCollapsibleItem$.subscribe(() => {
            this.toggleCollapsibleItem();
        });
    }

    hasContent(): boolean {
        for (let child of this.el.nativeElement.childNodes) {
            if ((<Element>child).tagName != null) {
                return true;
            }
        }
        return false;
    }

    toggleCollapsibleItem() {
        // console.debug(`toggleCollapsibleItem()`);

        // toggle body's state only if it has any childs
        if (this.hasContent()) {
            if (this.collapsibleService.getType() === 'accordion') {
                let tempExpanded = this.expanded;
                this.collapsibleService.collapseAll();
                this.expanded = tempExpanded;
            }
            this.expanded = !this.expanded;
            this.expandedState = this.expanded.toString();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.hasContent()) {
            for (let key of Object.keys(changes)) {
                if (key === 'expanded' &&
                    changes.expanded.currentValue != null) {
                    // console.debug('CollapsibleBody::ngOnChanges(), currentValue = ' + changes.expanded.currentValue);
                    // this.expanded = changes.expanded.currentValue;
                    this.expandedState = this.expanded.toString();
                }
            }
        }
    }

    // Makes sure we don't have a memory leak by destroying the
    // Subscription when our component is destroyed
    ngOnDestroy() {
        this.eventService.unsubscribe();
    }

}

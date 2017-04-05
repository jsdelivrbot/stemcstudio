import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'brand',
    // Place the template on one line in order to avoid spaces between the parts of the brand name.
    template: "<span class='md-logo-text-stem'>STEM</span><span class='md-logo-text-math'>C</span><span class='md-logo-text-studio'>studio</span>"
})
export class BrandComponent implements OnInit, OnDestroy {

    /**
     * OnInit Lifecycle Hook.
     */
    ngOnInit() {
        // console.warn("BrandComponent.ngOnInit() called");
    }

    /**
     * OnDestroy Lifecycle Hook.
     */
    ngOnDestroy() {
        // console.warn("BrandComponent.ngOnDestroy() called");
    }
}

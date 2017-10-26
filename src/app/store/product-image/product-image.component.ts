import {Component, Input, OnInit} from '@angular/core';
import {Product} from '@models/product';
import {ProductImageService} from "@services/product-image.service";
import {ProductImage} from "@models/product-image";

@Component({
  selector: 'product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.css']
})
export class ProductImageComponent implements OnInit {
  @Input() product: Product;
  @Input() productImage: ProductImage | null;
  @Input() cursorType = 'pointer';
  @Input() centerHorizontally = true;

  imgSrc = '';
  get imgStyle() {
    return {
      'cursor': this.cursorType,
      'max-height': '100%',
      'max-width': '100%',
      'width': 'auto',
      'height': 'auto',
      'margin': (this.centerHorizontally === true) ? ('0 auto') : ('auto')
    };
  }

  constructor(
    private productImageService: ProductImageService
  ) { }

  ngOnInit() {
    let _this = this;
    this.productImageService
      .getThumbnail(this.product)
      .then(
        (productImageSource) => _this.imgSrc = productImageSource,
        (rejectionReason) => console.log('Error retrieving image source: ', rejectionReason)
      );
  }

}
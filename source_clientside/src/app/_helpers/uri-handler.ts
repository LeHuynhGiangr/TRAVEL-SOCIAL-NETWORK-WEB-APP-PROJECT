import { Injectable } from '@angular/core';
import { ApiUrlConstants } from '../_core/common/api-url.constants';

@Injectable({
    providedIn:'any'
})
export class UriHandler{
  private getImageMime(base64: string): string
  {
    var tempString=String(base64);
    if (tempString.charAt(0)=='/') return 'jpg';
    else if (tempString.charAt(0)=='R') return "gif";
    else if(tempString.charAt(0)=='i') return 'png';
    else if(tempString.charAt(0)=="A") return "mp4";
    else return 'jpeg';
  }
  public getImageSource(base64: string): string
  {
    return `data:image/${this.getImageMime(base64)};base64,${base64}`; 
  }
  public getImageUrl(subPath:string): string{
    return ApiUrlConstants.API_URL + "/" + subPath;
  }
}
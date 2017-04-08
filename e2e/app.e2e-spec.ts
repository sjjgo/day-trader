import { InvestAppPage } from './app.po';

describe('invest-app App', () => {
  let page: InvestAppPage;

  beforeEach(() => {
    page = new InvestAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

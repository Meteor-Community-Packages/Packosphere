import { Packages, QRecentlyPublishedPackages } from '../../../api';

QRecentlyPublishedPackages.expose({
  firewall () {
    return true;
  },
});
export { Packages };

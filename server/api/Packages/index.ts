import { Packages, QPackagesByMaintainer } from '../../../api';

QPackagesByMaintainer.expose({
  firewall () {
    return true;
  },
});

export { Packages, QPackagesByMaintainer };

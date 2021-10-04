import {AuthService} from '../services/auth.service';

export function appInitializer(authService: AuthService) {
  return () => new Promise<void>(resolve => {
    if (authService.getRefreshToken() !== undefined && authService.getRefreshToken() !== null) {
      authService.refreshToken(authService.getRefreshToken()).subscribe().add(resolve);
    } else {
      resolve();
    }
  });
}

import { Service, signal } from '@angular/core';

@Service()
export class MembershipContextService {
    readonly selectedAccountId = signal<string | null>(null);

    setSelectedAccount(id: string) {
        this.selectedAccountId.set(id);
    }

    clear() {
        this.selectedAccountId.set(null)
    }
}

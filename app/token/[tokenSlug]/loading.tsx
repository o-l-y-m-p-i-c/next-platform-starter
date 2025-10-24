import { TokenPageSkeleton } from '../../../src/components/TokenPageSkeleton';
import { MainLayoutWrapper } from '../../components/MainLayoutWrapper';

export default function Loading() {
    return (
        <MainLayoutWrapper>
            <TokenPageSkeleton />
        </MainLayoutWrapper>
    );
}

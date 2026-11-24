import { call, put, delay, select, takeLeading } from 'redux-saga/effects';
import { fetchNewsBatch } from '../api/newsApi';
import { fetchNewsRequested, fetchNewsSucceeded, fetchNewsFailed } from './newsSlice';
import type { RootState } from './index';
import type { NewsPost } from '../types/news';

const RETRY_DELAY_MS = 3000;

function* handleFetchNewsSaga() {
    const items: Array<NewsPost> = yield select((state: RootState) => state.news.items);
    const lastSeenId = items.length > 0 ? items[items.length - 1].id : undefined;

    while (true) {
        try {
            const batch: Array<NewsPost> = yield call(fetchNewsBatch, lastSeenId);
            yield put(fetchNewsSucceeded(batch));
            return; // Exit retry loop on success
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Network error';
            yield put(fetchNewsFailed(message));
            yield delay(RETRY_DELAY_MS);
        }
    }
}

export function* rootSaga() {
    yield takeLeading(fetchNewsRequested.type, handleFetchNewsSaga);
}

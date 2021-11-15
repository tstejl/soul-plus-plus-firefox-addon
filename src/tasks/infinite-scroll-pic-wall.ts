import { getForumInfo, Selector } from '@/utilities/forum';
import InfiniteScroll from '@/tasks/infinite-scroll';
import $ from 'jquery';
import { getItem } from '@/utilities/storage';

export default async function TASK_InfiniteScrollPicWall() {
    if (await getItem('Switch::infinite-scroll-pic-wall')) return;
    if (!document.URL.includes('/thread_new.php')) return;
    const ThreadDetail = getForumInfo();
    if (!ThreadDetail) return;
    InfiniteScroll(
        // `/thread_new.php?fid=${ThreadDetail.fid}&page={page}`,
        ThreadDetail.currentPage,
        ThreadDetail.maxPage,
        `<tr class="tr2"><td colspan="12" class="tac" style="border-top:0;font-weight: bold">...</td></tr>`,
        Selector.PICWALL_THREAD,
        {
            fetchingNextPage: (divider, page) => divider.children(':only-child').text(`正在获取${ page + 1 }页的帖子`),
            nextPageReady: (divider, page) => divider.children(':only-child').text(`继续向下滚动将在下方加载第${ page + 1 }页的帖子`),
            fetchFailed: (divider, page) => divider.children(':only-child').text(`获取第${ page + 1 }的帖子失败了, 请检查你的网络或者刷新后重试`),
            nextPageLoaded: (divider, page) => divider.children(':only-child').text(`以下是第${ page + 1 }页的帖子`),
        },
        Selector.PICWALL_THREAD,
        (cache: Document) => {
            $(cache).find(Selector.PICWALL_THREAD_PIC).each((i, e) => {
                $(e).attr('src', $(e).data('original'));
                $(e).removeData('original');
                $(e).removeClass('lazy');
                $(e).css({ display: 'inline' });
            });
        },
    );
}

from application.models.Notification import Notification
from application.schemas.NotificationSchema import notifications_schema
from application.services.StockScreenerService import check_condition_notification
from application.utility.message_notification import gmail
import json
from application.services.StockCrawlerService import crawl_all_list_at_a_date
from application.services.StockPriceService import get_indicators, get_symbols, calculate_indicators_by_list_symbol_in_a_date
from datetime import datetime
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

dict_basic_operation = {
    'less' : ' < ',
    'eless' : ' <= ',
    'greater' : ' > ',
    'egreater' : ' >= ',
    'equal' : ' = ',
    'nequal' : ' <> ',
    'equals' : " = ",
}


def crawl_and_send_notification():
    try:
        date = datetime.today().strftime('%Y-%m-%d')
        crawl_all_list_at_a_date(date)

        list_symbols = get_symbols('all')
        list_indicators = get_indicators('all')
        calculate_indicators_by_list_symbol_in_a_date(list_indicators, list_symbols, datetime.strptime(date, '%Y-%m-%d'))
        send_notification()
    except Exception as e:
        logger.exception(e)


def send_notification():
    all_notifications = notifications_schema.dump(Notification.get_all())
    for notification in all_notifications:
        if notification['condition_key'] != None:
            condition_key = json.loads(notification['condition_key'])
            if check_condition_notification(condition_key):
                if notification['send_gmail'] == True:
                    send_gmail(notification)
                # if notification['send_telegram'] == True:
                #     send_gmail(notification)


def send_gmail(notification):
    if notification['gmail'] is not None:
        gmail_message = build_notification_message(notification)
        gmail.send_email([notification['gmail']], gmail_message)


def build_notification_message(notification):
    arr_res = []
    condition_key = json.loads(notification['condition_key'])
    filter_symbol = ''
    filter_date = ''
    for filter_item in condition_key:
        filter_type = filter_item.get('type')
        if filter_type == 'stock_date':
            filter_date = filter_item.get('value')
        elif filter_type == 'symbol':
            filter_symbol = filter_item.get('value')
        else:
            filter_operation = get_operation_description(filter_item.get('operation'))
            filter_value = filter_item.get('value')
            filter_label = filter_item.get('label')
            filter_text = f"- {filter_label} {filter_operation} {filter_value}"
            arr_res.append(filter_text)
    arr_res.insert(0, f'Symbol {filter_symbol} at {filter_date}:')
    return '\n'.join(arr_res)


def get_operation_description(filter_operation):
    if filter_operation in dict_basic_operation:
        return dict_basic_operation.get(filter_operation)
    else:
        return filter_operation


def send_telegram(notification):
    print('send_telegram to: ', notification['tg_chat_id'])


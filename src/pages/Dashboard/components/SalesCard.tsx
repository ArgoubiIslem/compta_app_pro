import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import moment from 'moment';
import { Column } from '@ant-design/charts';

import React from 'react';
import numeral from 'numeral';
import { DataItem } from '../data.d';
import styles from '../style.less';
import { useIntl } from 'umi';

type RangePickerValue = RangePickerProps<moment.Moment>['value'];
export type TimeType = 'today' | 'week' | 'month' | 'year';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData: { title: string; total: number }[] = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `Gongzhuan Road ${i} No. Store`,
    total: 323234,
  });
}

const SalesCard = ({
  rangePickerValue,
  salesData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}: {
  rangePickerValue: RangePickerValue;
  isActive: (key: TimeType) => string;
  salesData: DataItem[];
  loading: boolean;
  handleRangePickerChange: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  selectDate: (key: TimeType) => void;
}) => (
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
              <a className={isActive('today')} onClick={() => selectDate('today')}>
              {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.today' })}`}
              </a>
              <a className={isActive('week')} onClick={() => selectDate('week')}>
              {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.week' })}`}
              </a>
              <a className={isActive('month')} onClick={() => selectDate('month')}>
              {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.month' })}`}
              </a>
              <a className={isActive('year')} onClick={() => selectDate('year')}>
              {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.year' })}`}
              </a>
            </div>
            <RangePicker
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              style={{ width: 256 }}
            />
          </div>
        }
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      >
        <TabPane
          tab={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Sales' })}`}
          key="sales"
        >
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Column
                  height={300}
                  forceFit
                  data={salesData as any}
                  xField= 'x'
                  yField='y'
                  xAxis={{
                    visible: true,
                    title: {
                      visible: false
                    }
                  }}
                  yAxis={{
                    visible: true,
                    title: {
                      visible: false
                    }
                  }}
                  title={{
                    visible: true,
                    text:  `${useIntl().formatMessage({ id: 'app.pwa.dashboard.Sales trend' })}`,
                    style: {
                      fontSize: 14
                    }
                  }}
                  meta={{
                    y: {
                      alias:`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Sales volume' })}`
                    }
                  }}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Store sales ranking' })}`}
                </h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                        {item.title}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {numeral(item.total).format('0,0')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Views' })}`} key="views">
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Column
                  height={300}
                  forceFit
                  data={salesData as any}
                  xField= 'x'
                  yField='y'
                  xAxis={{
                    visible: true,
                    title: {
                      visible: false
                    }
                  }}
                  yAxis={{
                    visible: true,
                    title: {
                      visible: false
                    }
                  }}
                  title={{
                    visible: true,
                    text: `${useIntl().formatMessage({ id: 'app.pwa.dashboard.Traffic trend' })}` ,
                    style: {
                      fontSize: 14
                    }
                  }}
                  meta={{
                    y: {
                      alias:`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Store visits Views' })}`
                    }
                  }}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Store visits ranking' })}`}
                </h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                        {item.title}
                      </span>
                      <span>{numeral(item.total).format('0,0')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
);

export default SalesCard;

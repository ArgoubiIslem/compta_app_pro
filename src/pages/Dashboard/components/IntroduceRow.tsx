import { InfoCircleOutlined } from '@ant-design/icons';
import { TinyArea, TinyColumn, Progress } from '@ant-design/charts';
import { Col, Row, Tooltip  } from 'antd';

import React from 'react';
import numeral from 'numeral';
import { ChartCard, Field } from './Charts';
import { DataItem } from '../data.d';
import Trend from './Trend';
import styles from '../style.less';
import { useIntl } from 'umi';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: DataItem[] }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="Total sales"
        action={
          <Tooltip
            title={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Index description' })}`}
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => 126560}
        footer={
          <Field
            label={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Daily sales' })}`}
            value={`${numeral(12423).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
        {useIntl().formatMessage({ id: 'app.pwa.dashboard.weekly' })}
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag="down">
        {useIntl().formatMessage({ id: 'app.pwa.dashboard.yoy' })}
          <span className={styles.trendText}>11%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Views' })}`}
        action={
          <Tooltip
            title={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Index description' })}`}
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(8846).format('0,0')}
        footer={
          <Field
            label={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Daily visits' })}`}
            value={numeral(1234).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <TinyArea
          color="#975FE4"
          xField="x"
          height={46}
          forceFit
          yField="y"
          smooth
          data={visitData}
        />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Number of payments' })}`}
        action={
          <Tooltip
            title={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Index description' })}`}
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        footer={
          <Field
            label={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Conversion rates' })}`}
            value="60%"
          />
        }
        contentHeight={46}
      >
        <TinyColumn
          xField="x"
          height={46}
          forceFit
          yField="y"
          data={visitData}
        />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Operational effects' })}`}
        action={
          <Tooltip
            title={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Index description' })}`}
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        total="78%"
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="up" style={{ marginRight: 16 }}>
            {useIntl().formatMessage({ id: 'app.pwa.dashboard.weekly' })}
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
            {useIntl().formatMessage({ id: 'app.pwa.dashboard.yoy' })}
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <Progress
          height={46}
          percent={0.78}
          color="#13C2C2"
          forceFit
          size={8}
          marker={[
            {
              value: 0.8,
              style: {
                stroke: '#13C2C2',
              },
            }
          ]}
        />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;

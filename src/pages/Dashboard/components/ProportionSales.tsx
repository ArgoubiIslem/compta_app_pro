import { Card, Radio, Typography } from 'antd';
import numeral from 'numeral';
import { RadioChangeEvent } from 'antd/es/radio';
import { Donut } from '@ant-design/charts';
import { DonutConfig } from '@ant-design/charts/es/donut'
import React from 'react';
import { DataItem } from '../data.d';
import styles from '../style.less';
import { useIntl } from 'umi';

const { Text } = Typography;

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}: {
  loading: boolean;
  dropdownGroup: React.ReactNode;
  salesType: 'all' | 'online' | 'stores';
  salesPieData: DataItem[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Percentage of sales category' })}`}
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value="all">
            {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.All channels' })}`}
            </Radio.Button>
            <Radio.Button value="online">
            {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.on-line' })}`}
            </Radio.Button>
            <Radio.Button value="stores">
            {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Store' })}`}
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <Text>{`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Sales' })}`}</Text>
      <Donut
        forceFit
        height={340}
        radius={0.8}
        angleField="y"
        colorField="x"
        data={salesPieData as any}
        legend={{
          visible: false
        }}
        label={{
          visible: true,
          type: 'spider',
          formatter: (text, item) => {
            // eslint-disable-next-line no-underscore-dangle
            return `${item._origin.x}: ${numeral(item._origin.y).format('0,0')}`;
          }
        }}
        statistic={{
          totalLabel: `${useIntl().formatMessage({ id: 'app.pwa.dashboard.Sales' })}`
        } as DonutConfig['statistic']}
      />
    </div>
  </Card>
);

export default ProportionSales;

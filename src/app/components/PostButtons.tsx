"use client";

import { CoffeeOutlined, SettingOutlined } from '@ant-design/icons';
import { FloatButton } from "antd";

type Props = {
  isLogin: boolean;
};

export default function PostButtons(props: Props) {
  if (props.isLogin) {
    return (
      <div>
        <FloatButton
          href="/settings"
          icon={<SettingOutlined />}
          style={{ insetBlockEnd: 90, insetInlineEnd: 30 }}
        ></FloatButton>
        <FloatButton
          href="/post"
          icon={<CoffeeOutlined />}
          style={{ insetBlockEnd: 30, insetInlineEnd: 30 }}
        ></FloatButton>
      </div>
    );
  } else {
    return (
      <div>
        <FloatButton
          href="/settings"
          icon={<SettingOutlined />}
          style={{ insetBlockEnd: 30, insetInlineEnd: 30 }}
        ></FloatButton>
      </div>
    );
  }
}

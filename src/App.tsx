import React, {
  useState,
  useCallback,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { Layout, Menu } from "antd";
import Config from "./Config";
import Server from "./Server";
import { reducer, initialState, StateContext, Action } from "./reducer";
import { Api } from "./api";

const { Header, Content, Footer } = Layout;

const contentStyle = { padding: "50px 50px 0" } as const;
const footerStyle = { textAlign: "center" } as const;

enum TabName {
  Server = "server",
  Config = "config",
}

export default function App() {
  const [tab, setTab] = useState(TabName.Server);
  const selectedKeys = useMemo(() => [tab], [tab]);
  const onTabSelect = useCallback(({ key }) => setTab(key), []);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const backgroundChecker = setInterval(() => {
      if (state.ServerConnected) {
        Api.ping().catch(() => {
          dispatch({
            type: Action.ServerConnected,
            value: false,
          });
          setTab(TabName.Server);
        });
      }
    }, 15000);
    return () => clearInterval(backgroundChecker);
  }, [state]);

  const disabledConfig = useMemo(() => {
    return state.ServerConnected === false;
  }, [state]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Layout className="layout">
        <Header>
          <div className="logo">portfwd-web</div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={selectedKeys}
            onSelect={onTabSelect}
          >
            <Menu.Item disabled={disabledConfig} key={TabName.Config}>
              配置
            </Menu.Item>
            <Menu.Item key={TabName.Server}>服务器</Menu.Item>
          </Menu>
        </Header>
        <Content style={contentStyle}>
          <div className="site-layout-content">
            {tab === TabName.Config ? <Config /> : <Server />}
          </div>
        </Content>
        <Footer style={footerStyle}>portfwd-web ©2020 Created by muzea</Footer>
      </Layout>
    </StateContext.Provider>
  );
}

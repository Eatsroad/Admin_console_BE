import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "../../../src/console/category/category.service";
import { MenuService } from "../../../src/console/menu/menu.service";
import { OptionService } from "../../../src/console/option/option.service";
import { OptiongroupService } from "../../../src/console/optiongroup/optiongroup.service";
import { StoreService } from "../../../src/console/store/store.service";
import { Category } from "../../../src/entities/category/category.entity";
import { EnableTime } from "../../../src/entities/menu/enableTime.entity";
import { Menu } from "../../../src/entities/menu/menu.entity";
import { OptionGroup } from "../../../src/entities/option/optionGroup.entity";
import { Store } from "../../../src/entities/store/store.entity";
import { User } from "../../../src/entities/user/user.entity";
import { createMemoryDB } from "../../../src/utils/connections/create-memory-db";
import { Connection, getRepository, Repository } from "typeorm";
import { MenuboardService } from "./menuboard.service";
import { Option } from "../../../src/entities/option/option.entity";
import { NotFoundException } from "@nestjs/common";

describe("MenuboardService", () => {
  let menuboardService: MenuboardService;
  let connection: Connection;

  /*
  let storeService : StoreService;
  let menuService : MenuService;
  let categoryService : CategoryService;
  let optiongroupService : OptiongroupService;
  let optionService : OptionService;
*/

  // 카테고리 생성

  //store
  let storeRepository: Repository<Store>;
  let storeService: StoreService;

  const NAME = "NAME";
  const ADDRESS = "ADDRESS";
  const PHONE_NUMBER = "01012345667";
  const TABLES = 45;
  const USERID = null;

  const saveStore = async (): Promise<Store> => {
    const savedStore = new Store();
    savedStore.setName = NAME;
    savedStore.setAddress = ADDRESS;
    savedStore.setPhone_number = PHONE_NUMBER;
    savedStore.setTables = TABLES;
    savedStore.user = USERID;
    return await storeRepository.save(savedStore);
  };
  //category
  let categoryRepoditory: Repository<Category>;
  let categoryService: CategoryService;

  const CategoryName = "CategoryName";
  const CategoryDesc = "CategoryDes";
  const Role = "ETC";
  const State = "주문 가능";

  const ResMenu: Menu[] = [];

  const saveCategory = async (): Promise<Category> => {
    const savedCategory = new Category();

    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.menus = ResMenu;
    savedCategory.setCategoryState = "true";
    savedCategory.setCategoryRole = Role;
    savedCategory.setCategoryState = State;
    savedCategory.store = await getRepository(Store).findOne(1);
    return await categoryRepoditory.save(savedCategory);
  };
  //menu
  let menuRepository: Repository<Menu>;
  let menuService: MenuService;

  // optiongroup
  let optionGroupRepository: Repository<OptionGroup>;
  let optionGroupService: OptiongroupService;

  // option
  let optionRepository: Repository<Option>;
  let optionService: OptionService;

  //

  beforeAll(async () => {
    connection = await createMemoryDB([
      Category,
      Menu,
      Store,
      User,
      EnableTime,
      OptionGroup,
      Option,
    ]);

    storeRepository = await connection.getRepository(Store);
    storeService = new StoreService(storeRepository);

    categoryRepoditory = await connection.getRepository(Category);
    categoryService = new CategoryService(categoryRepoditory);

    menuRepository = await connection.getRepository(Menu);
    menuService = new MenuService(menuRepository);

    optionGroupRepository = await connection.getRepository(OptionGroup);
    optionGroupService = new OptiongroupService(optionGroupRepository);

    optionRepository = await connection.getRepository(Option);
    optionService = new OptionService(optionRepository);

    menuboardService = new MenuboardService(
      categoryRepoditory,
      menuRepository,
      optionGroupRepository
    );

    // console.log((await storeService.getStoreInfo(1)).name);
    // console.log(await categoryService.getCategoryInfo(1));
    // console.log(await menuboardService.getCategoryByStoreId(1));
  });

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [MenuboardService],
  //   }).compile();

  //   menuboardService = module.get<MenuboardService>(MenuboardService);
  // });

  // it("should be defined", () => {
  //   expect(storeService).toBeDefined();
  // });

  it("should get correct category info", async () => {
    await saveStore();
    await saveCategory();

    const response = await menuboardService.getCategoryByStoreId(1);
    expect(response[0].name).toBe("CategoryName");
    expect(response[0].description).toBe("CategoryDes");
    expect(response[0].role).toBe("ETC");
    expect(response[0].state).toBe("주문 가능");
  });

  it("should throw NotFoundException if storeId is not exist", async () => {
    try {
      await menuboardService.getCategoryByStoreId(-100);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("should get correct menu info", async () => {
    const menu1 = new Menu();
    menu1.setMenuName = "menu1";
    menu1.setMenuPrice = 5000;
    menu1.setMenuDesc = "Delicious";
    await connection.manager.save(menu1);

    const menu2 = new Menu();
    menu2.setMenuName = "menu2";
    menu2.setMenuPrice = 4000;
    menu2.setMenuState = "OK";
    await connection.manager.save(menu2);

    const MenuList = [menu1, menu2];

    const savedCategory = new Category();
    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.menus = MenuList;

    await categoryRepoditory.save(savedCategory);

    const response = await menuboardService.getMenuByCategoryId(
      savedCategory.getCategoryId
    );
    expect(response.menus[0].getMenuName).toBe("menu1");
    expect(response.menus[0].getMenuPrice).toBe(5000);
    expect(response.menus[0].getMenuDesc).toBe("Delicious");
    expect(response.menus[1].getMenuName).toBe("menu2");
    expect(response.menus[1].getMenuPrice).toBe(4000);
    expect(response.menus[1].getMenuState).toBe("OK");
  });

  it("should throw NotFoundException if categoryId is not exist", async () => {
    try {
      await menuboardService.getMenuByCategoryId(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(TypeError);
    }
  });
  //--------------------------------------------------------------------------------------------------------------

  it("should get correct optiongroup info", async () => {
    const optiongroup1 = new OptionGroup();
    optiongroup1.setOptionGroupName = "optiongroup1";
    optiongroup1.setOptionGroupDesc = "optiongroup1Desc";
    optiongroup1.setOptionGroupState = "true";
    await connection.manager.save(optiongroup1);

    const optiongroup2 = new OptionGroup();
    optiongroup2.setOptionGroupName = "optiongroup2";
    optiongroup2.setOptionGroupDesc = "optiongroup2Desc";
    optiongroup2.setOptionGroupState = "true";
    await connection.manager.save(optiongroup2);

    const OptiongroupList = [optiongroup1, optiongroup2];

    const savedMenu = new Menu();
    savedMenu.setMenuName = "MenuEx";
    savedMenu.setMenuPrice = 10000;
    savedMenu.optionGroups = OptiongroupList;

    await menuRepository.save(savedMenu);

    const response = await menuboardService.getDetailBymenuId(
      savedMenu.getMenuId
    );
    expect(response.optiongroups[0].getOptionGroupName).toBe("optiongroup1");
    expect(response.optiongroups[0].getOptionGroupDesc).toBe(
      "optiongroup1Desc"
    );
    expect(response.optiongroups[0].getOptionGroupState).toBe("true");
    expect(response.optiongroups[1].getOptionGroupName).toBe("optiongroup2");
    expect(response.optiongroups[1].getOptionGroupDesc).toBe(
      "optiongroup2Desc"
    );
    expect(response.optiongroups[1].getOptionGroupState).toBe("true");
  });

  it("should throw NotFoundException if menuId is not exist", async () => {
    try {
      await menuboardService.getDetailBymenuId(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(TypeError);
    }
  });

  //-------------------------------------------------------------------------------------------------
  it("should get correct option info", async () => {
    const option1 = new Option();
    option1.setOptionName = "option1";
    option1.setOptionPrice = 3000;
    option1.setOptionState = "true";
    await connection.manager.save(option1);

    const option2 = new Option();
    option2.setOptionName = "option2";
    option2.setOptionPrice = 2000;
    option2.setOptionState = "true";
    await connection.manager.save(option2);

    const OptionList = [option1, option2];

    const savedOptiongroup = new OptionGroup();
    savedOptiongroup.setOptionGroupName = "OptiongroupName";
    savedOptiongroup.setOptionGroupDesc = "optiongroupDesc";
    savedOptiongroup.option_id = OptionList;

    await optionGroupRepository.save(savedOptiongroup);

    const response = await menuboardService.getOptionByOptiongroupId(
      savedOptiongroup.getOptionGroupId
    );
    expect(response.option[0].getOptionName).toBe("option1");
    expect(response.option[0].getOptionPrice).toBe(3000);
    expect(response.option[0].getOptionState).toBe("true");
    expect(response.option[1].getOptionName).toBe("option2");
    expect(response.option[1].getOptionPrice).toBe(2000);
    expect(response.option[1].getOptionState).toBe("true");
  });

  it("should throw NotFoundException if optionGroupId is not exist", async () => {
    try {
      await menuboardService.getOptionByOptiongroupId(-1);
    } catch (exception) {
      expect(exception).toBeInstanceOf(TypeError);
    }
  });
});
